import {
    BadRequestException,
    CreateRecipeDto,
    IIngredientDto,
    IngredientDto,
    IRecipeIngredientPacket,
    IRecipeCombinedPacket,
    NotFoundException,
    RecipeDto,
    UpdateRecipeDto,
    GetRecipeDto,
    DeleteRecipeDto,
} from "../../models/_.loader";
import {
    AuthRepository,
    RecipeIngredientRepository,
    RecipeIngredientListRepository,
    RecipeRepository,
} from "../repositories/_.exporter";
import { MysqlProvider } from "../../modules/_.loader";

export class RecipeService {
    private recipeRepository: RecipeRepository;
    private recipeIngredientRepository: RecipeIngredientRepository;
    private recipeIngredientListRepository: RecipeIngredientListRepository;
    private authRepository: AuthRepository;
    private mysqlProvider: MysqlProvider;

    constructor() {
        this.recipeRepository = new RecipeRepository();
        this.recipeIngredientRepository = new RecipeIngredientRepository();
        this.recipeIngredientListRepository = new RecipeIngredientListRepository();
        this.mysqlProvider = new MysqlProvider();
        this.authRepository = new AuthRepository();
    }
    // Create

    createRecipe = async (recipeDto: CreateRecipeDto): Promise<number> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const isExists = await this.authRepository.isExistsById(conn, recipeDto.userId);
            if (isExists === false)
                throw new NotFoundException(`이미 탈퇴한 사용자의 AccessToken 입니다.`, "AUTH-007-01");

            const recipeId: number = await this.recipeRepository.createRecipe(conn, recipeDto);

            const ingredientList: IngredientDto[] = recipeDto.ingredientList;
            const insertedIdList = await this.recipeRepository.createRecipeIngredients(conn, recipeId, ingredientList);
            const createUserRecipe = await this.recipeRepository.createUserRecipe(conn, recipeDto.userId, recipeId);

            await this.recipeRepository.createRecipeIngredientList(conn, recipeId, insertedIdList);

            await conn.commit();
            return recipeId;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };

    // Get

    getRecipe = async (recipeId: number): Promise<IRecipeCombinedPacket[]> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const findRecipeById = await this.recipeRepository.findRecipeById(conn, recipeId);
            if (!findRecipeById) throw new NotFoundException("존재하지 않는 레시피입니다.", "RECIPE-001");

            const getRecipe = await this.recipeRepository.getRecipe(conn, recipeId);

            await conn.commit();

            return getRecipe;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };

    getRecipes = async (getRecipeDto: GetRecipeDto, filterOptions?: object): Promise<RecipeDto[]> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            if (filterOptions === undefined) {
                const recipeList: IRecipeCombinedPacket[] = await this.recipeRepository.getRecipes(conn, getRecipeDto);

                const recipeIdList = recipeList.map(({ recipeId }) => recipeId);

                // @dpereacted
                // const recipeIngredientIdList = await this.recipeIngredientListRepository.getRecipeIngrdientList(
                //     conn,
                //     recipeIdList,
                // );

                const recipeIngredientList: IRecipeIngredientPacket[][] = await Promise.all(
                    recipeIdList.map(
                        async (recipeId) =>
                            await this.recipeIngredientRepository.getRecipeIngredientsByRecipeid(conn, recipeId),
                    ),
                );

                const recipeDtoList = new Array<RecipeDto>();
                const loopLength = recipeList.length;
                for (let i = 0; i < loopLength; i++) {
                    const recipeDto = new RecipeDto({
                        recipeId: recipeList[i].recipeId,
                        title: recipeList[i].title,
                        content: recipeList[i].content,
                        isIced: recipeList[i].isIced,
                        cupSize: recipeList[i].cupSize,
                        createdAt: recipeList[i].createdAt,
                        updatedAt: recipeList[i].updatedAt,
                        ingredientList: recipeIngredientList[i].map((ingredient): IIngredientDto => {
                            return {
                                ingredientName: ingredient.ingredientName,
                                ingredientAmount: ingredient.ingredientAmount,
                                ingredientColor: ingredient.ingredientColor,
                            };
                        }),
                        nickname: recipeList[i].nickname,
                        imageUrl: recipeList[i].imageUrl,
                        resizedUrl: recipeList[i].resizedUrl,
                    });
                    recipeDtoList.push(recipeDto);
                }

                await conn.commit();
                return recipeDtoList;
            } else {
                // 이번 주 구현 예정
                throw new BadRequestException(`필터 기반 검색은 아직 지원하지 않는 도메인입니다.`, "UNKOWN");
            }
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            await conn.release();
        }
    };

    // Update

    updateRecipe = async (updateRecipeDto: UpdateRecipeDto): Promise<void> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const isExists = await this.authRepository.isExistsById(conn, updateRecipeDto.userId);
            if (isExists === false)
                throw new NotFoundException(`이미 탈퇴한 사용자의 AccessToken 입니다.`, "AUTH-007-01");

            const findRecipeById = await this.recipeRepository.findRecipeById(conn, updateRecipeDto.recipeId);
            if (!findRecipeById) throw new NotFoundException("존재하지 않는 레시피입니다.", "RECIPE-001");

            const isAuthenticated = await this.recipeRepository.isAuthenticatedByUserId(
                conn,
                updateRecipeDto.recipeId,
                updateRecipeDto.userId,
            );
            if (!isAuthenticated) throw new NotFoundException("내가 작성한 레시피가 아닙니다.", "RECIPE-002");

            const updateRecipe = this.recipeRepository.updateRecipeById(conn, updateRecipeDto);
            const deleteRecipeIngredient = this.recipeRepository.deleteRecipeIngredientById(
                conn,
                updateRecipeDto.recipeId,
            );

            await Promise.all([updateRecipe, deleteRecipeIngredient]);

            const result = updateRecipeDto.ingredientList.map((e) => {
                return {
                    recipe_id: updateRecipeDto.recipeId,
                    ingredient_name: e.ingredientName,
                    ingredient_color: e.ingredientColor,
                    ingredient_amount: e.ingredientAmount,
                };
            });

            // await this.recipeRepository.createRecipeIngredientLegacy(conn, result);

            const updateRecipeIngredient = await this.recipeRepository.createRecipeIngredientLegacy(conn, result);

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            await conn.release();
        }
    };

    // Delete

    deleteRecipe = async (deleteRecipeDto: DeleteRecipeDto): Promise<boolean> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const isExists = await this.authRepository.isExistsById(conn, deleteRecipeDto.userId);
            if (isExists === false)
                throw new NotFoundException(`이미 탈퇴한 사용자의 AccessToken 입니다.`, "AUTH-007-01");

            const findRecipeById = await this.recipeRepository.findRecipeById(conn, deleteRecipeDto.recipeId);
            if (!findRecipeById) throw new NotFoundException("존재하지 않는 레시피입니다.", "RECIPE-001");

            const isAuthenticated = await this.recipeRepository.isAuthenticatedByUserId(
                conn,
                deleteRecipeDto.recipeId,
                deleteRecipeDto.userId,
            );
            if (!isAuthenticated) throw new NotFoundException("내가 작성한 레시피가 아닙니다.", "RECIPE-002");

            await this.recipeRepository.deleteRecipeById(conn, deleteRecipeDto.recipeId);

            await conn.commit();
            return true;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };

    // Special

    likeRecipe = async (likeRecipeDto: DeleteRecipeDto): Promise<void> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const isExists = await this.authRepository.isExistsById(conn, likeRecipeDto.userId);
            if (isExists === false)
                throw new NotFoundException(`이미 탈퇴한 사용자의 AccessToken 입니다.`, "AUTH-007-01");

            const findRecipeById = await this.recipeRepository.findRecipeById(conn, likeRecipeDto.recipeId);
            if (!findRecipeById) throw new NotFoundException("존재하지 않는 레시피입니다.", "RECIPE-001");

            const existLikeRecipe = await this.recipeRepository.existLikeRecipeById(
                conn,
                likeRecipeDto.userId,
                likeRecipeDto.recipeId,
            );
            if (existLikeRecipe) throw new BadRequestException("이미 좋아요를 한 레시피입니다.", "RECIPE-003-01");

            await this.recipeRepository.likeRecipe(conn, likeRecipeDto);

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };

    disLikeRecipe = async (dislikeRecipeDto: DeleteRecipeDto): Promise<void> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const isExists = await this.authRepository.isExistsById(conn, dislikeRecipeDto.userId);
            if (isExists === false)
                throw new NotFoundException(`이미 탈퇴한 사용자의 AccessToken 입니다.`, "AUTH-007-01");

            const findRecipeById = await this.recipeRepository.findRecipeById(conn, dislikeRecipeDto.recipeId);
            if (!findRecipeById) throw new NotFoundException("존재하지 않는 레시피입니다.", "RECIPE-001");

            const existDislikeRecipe = await this.recipeRepository.existLikeRecipeById(
                conn,
                dislikeRecipeDto.userId,
                dislikeRecipeDto.recipeId,
            );
            if (!existDislikeRecipe) throw new BadRequestException("좋아요를 하지 않은 레시피입니다.", "RECIPE-003-02");

            await this.recipeRepository.disLikeRecipe(conn, dislikeRecipeDto);

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };
}
