import { AuthRepository } from "../repositories/auth.repository";
import { BcryptProvider, MulterProvider, MysqlProvider } from "../../modules/_.loader";
import {
    EditProfileDto,
    GetMyProfileDto,
    GetMyRecipeDto,
    IIngredientDto,
    IRecipeIngredientPacket,
    IUserPacket,
    NotFoundException,
    RecipeDto,
} from "../../models/_.loader";
import { RecipeRepository, RecipeIngredientRepository, UserCategoryRepository } from "../repositories/_.exporter";
import { GetLikeRecipeDto } from "models/dtos/profile/get.like.recipe.dto";

export class ProfileService {
    private mysqlProvider: MysqlProvider;
    private bcryptProvider: BcryptProvider;
    private authRepository: AuthRepository;
    private recipeRepository: RecipeRepository;
    private recipeIngredientRepository: RecipeIngredientRepository;
    private userCategoryRepository: UserCategoryRepository;

    constructor() {
        this.bcryptProvider = new BcryptProvider();
        this.mysqlProvider = new MysqlProvider();

        this.authRepository = new AuthRepository();
        this.recipeRepository = new RecipeRepository();
        this.recipeIngredientRepository = new RecipeIngredientRepository();
        this.userCategoryRepository = new UserCategoryRepository();
    }

    public getAllProfile = async (): Promise<IUserPacket[]> => {
        const conn = await this.mysqlProvider.getConnection();

        return await this.authRepository.findAllUser(conn);
    };

    public editProfile = async (editDto: EditProfileDto): Promise<void> => {
        // 유저 있는 지 확인
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();

            if (editDto.password) editDto.password = this.bcryptProvider.hashPassword(editDto.password);

            const isExists = await this.authRepository.isExistsById(conn, editDto.userId);
            if (isExists === false)
                throw new NotFoundException(`이미 탈퇴한 사용자의 AccessTokne 입니다.`, "AUTH-007-01");

            if (editDto.imageUrl && editDto.resizedUrl) {
                const imageKey = editDto.imageUrl.split("/")[4];
                const resizedKey = imageKey;
                MulterProvider.deleteImage(imageKey, "profile");
                MulterProvider.deleteImage(resizedKey, "profile-resized");
            }

            await this.authRepository.updateUserProfile(conn, editDto);
            await Promise.all([
                (async () => {
                    await this.userCategoryRepository.deleteAllFavorCateogryList(conn, editDto.userId);
                    await this.userCategoryRepository.createFavorCategoryList(
                        conn,
                        editDto.userId,
                        editDto.favorCategory,
                    );
                })(),
                (async () => {
                    await this.userCategoryRepository.deleteAllDisfavorCateogryList(conn, editDto.userId);
                    await this.userCategoryRepository.createDisfavorCategoryList(
                        conn,
                        editDto.userId,
                        editDto.disfavorCategory,
                    );
                })(),
            ]);

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };

    public getMyProfile = async (getMyProfileDto: GetMyProfileDto) => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            const user = await this.authRepository.findUserById(conn, getMyProfileDto.userId);

            await conn.commit();
            return user;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };

    public getMyRecipe = async (geMyRecipeDto: GetMyRecipeDto): Promise<RecipeDto[]> => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();

            const user = await this.authRepository.findUserById(conn, geMyRecipeDto.userId);
            if (user === null) throw new NotFoundException("이미 탈퇴한 사용자의 AccessToken 입니다.", "AUTH-007-01");

            const myRecipeList = await this.recipeRepository.getMyRecipeByUserId(
                conn,
                geMyRecipeDto.userId,
                geMyRecipeDto.page,
                geMyRecipeDto.count,
            );
            const myRecipeIdList = myRecipeList.map(({ recipeId }) => recipeId);

            const myRecipeIngredientList: IRecipeIngredientPacket[][] = await Promise.all(
                myRecipeIdList.map(
                    async (recipeId) =>
                        await this.recipeIngredientRepository.getRecipeIngredientsByRecipeid(conn, recipeId),
                ),
            );

            const loopLength = myRecipeIdList.length;
            const recipeDtoList = new Array<RecipeDto>();
            for (let i = 0; i < loopLength; i++) {
                const recipeDto = new RecipeDto({
                    recipeId: myRecipeList[i].recipeId,
                    title: myRecipeList[i].title,
                    content: myRecipeList[i].content,
                    isIced: myRecipeList[i].isIced,
                    cupSize: myRecipeList[i].cupSize,
                    createdAt: myRecipeList[i].createdAt,
                    updatedAt: myRecipeList[i].updatedAt,
                    ingredientList: myRecipeIngredientList[i].map((ingredient): IIngredientDto => {
                        return {
                            ingredientName: ingredient.ingredientName,
                            ingredientAmount: ingredient.ingredientAmount,
                            ingredientColor: ingredient.ingredientColor,
                        };
                    }),
                    nickname: user.nickname,
                    imageUrl: user.imageUrl,
                    resizedUrl: user.resizedUrl,
                    isLiked: myRecipeList[i].isLiked === 1,
                });

                recipeDtoList.push(recipeDto);
            }

            await conn.commit();
            return recipeDtoList;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };

    public getLikeRecipe = async (getLikeRecipeDto: GetLikeRecipeDto): Promise<RecipeDto[]> => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();

            const user = await this.authRepository.findUserById(conn, getLikeRecipeDto.userId);
            if (user === null) throw new NotFoundException(`이미 탈퇴한 사용자의 AccessToken 입니다.`, "AUTH-007-01");

            const myRecipeList = await this.recipeRepository.getLikeRecipeByUserid(
                conn,
                getLikeRecipeDto.userId,
                getLikeRecipeDto.page,
                getLikeRecipeDto.count,
            );
            const myRecipeIdList = myRecipeList.map(({ recipeId }) => recipeId);

            const myRecipeIngredientList: IRecipeIngredientPacket[][] = await Promise.all(
                myRecipeIdList.map(
                    async (recipeId) =>
                        await this.recipeIngredientRepository.getRecipeIngredientsByRecipeid(conn, recipeId),
                ),
            );

            const loopLength = myRecipeIdList.length;
            const recipeDtoList = new Array<RecipeDto>();
            for (let i = 0; i < loopLength; i++) {
                const recipeDto = new RecipeDto({
                    recipeId: myRecipeList[i].recipeId,
                    title: myRecipeList[i].title,
                    content: myRecipeList[i].content,
                    isIced: myRecipeList[i].isIced,
                    cupSize: myRecipeList[i].cupSize,
                    createdAt: myRecipeList[i].createdAt,
                    updatedAt: myRecipeList[i].updatedAt,
                    ingredientList: myRecipeIngredientList[i].map((ingredient): IIngredientDto => {
                        return {
                            ingredientName: ingredient.ingredientName,
                            ingredientAmount: ingredient.ingredientAmount,
                            ingredientColor: ingredient.ingredientColor,
                        };
                    }),
                    nickname: user.nickname,
                    imageUrl: user.imageUrl,
                    resizedUrl: user.resizedUrl,
                    isLiked: myRecipeList[i].isLiked === 1,
                });

                recipeDtoList.push(recipeDto);
            }

            await conn.commit();
            return recipeDtoList;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };
}
