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

    createRecipe = async (recipeDto: CreateRecipeDto, userId: number): Promise<number> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const isExists = await this.authRepository.isExistsById(conn, userId);
            if (isExists === false) throw new NotFoundException(`이미 탈퇴한 사용자의 토큰입니다.`);

            const recipeId: number = await this.recipeRepository.createRecipe(conn, recipeDto);

            const ingredientList: IngredientDto[] = recipeDto.ingredientList;
            const insertedIdList = await this.recipeRepository.createRecipeIngredients(conn, recipeId, ingredientList);
            const createUserRecipe = await this.recipeRepository.createUserRecipe(conn, userId, recipeId);

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

    getRecipe = async (recipeId: number): Promise<IRecipeCombinedPacket[]> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const findRecipeById = await this.recipeRepository.findRecipeById(conn, recipeId);
            if (!findRecipeById) throw new Error("존재하지 않는 레시피입니다.");

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

    getRecipes = async (page: number, count: number, filterOptions?: object): Promise<RecipeDto[]> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            if (filterOptions === undefined) {
                const recipeList: IRecipeCombinedPacket[] = await this.recipeRepository.getRecipes(conn, page, count);

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
                throw new BadRequestException(`필터 기반 검색은 아직 지원하지 않는 도메인입니다.`);
            }
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            await conn.release();
        }
    };

    deleteRecipe = async (recipeId: number, userId: number): Promise<boolean> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const isExists = await this.authRepository.isExistsById(conn, userId);
            if (isExists === false) throw new NotFoundException(`이미 탈퇴한 사용자의 토큰입니다.`);

            const findRecipeById = await this.recipeRepository.findRecipeById(conn, recipeId);
            if (!findRecipeById) throw new Error("존재하지 않는 레시피입니다.");

            const isAuthenticated = await this.recipeRepository.isAuthenticated(conn, recipeId, userId);
            if (!isAuthenticated) throw new Error("내가 작성한 레시피가 아닙니다.");

            await this.recipeRepository.deleteRecipe(conn, recipeId);

            await conn.commit();
            return true;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };

    updateRecipe = async (updateRecipeDto: UpdateRecipeDto, recipeId: number, userId: number): Promise<void> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const isExists = await this.authRepository.isExistsById(conn, userId);
            if (isExists === false) throw new NotFoundException(`이미 탈퇴한 사용자의 토큰입니다.`);

            const findRecipeById = await this.recipeRepository.findRecipeById(conn, recipeId);
            if (!findRecipeById) throw new Error("존재하지 않는 레시피입니다.");

            const isAuthenticated = await this.recipeRepository.isAuthenticated(conn, recipeId, userId);
            if (!isAuthenticated) throw new Error("내가 작성한 레시피가 아닙니다.");

            const updateRecipe = this.recipeRepository.updateRecipe(conn, updateRecipeDto, recipeId);
            const deleteRecipeIngredient = this.recipeRepository.deleteRecipeIngredient(conn, recipeId);

            await Promise.all([updateRecipe, deleteRecipeIngredient]);

            const result = updateRecipeDto.ingredientList.map((e) => {
                return {
                    recipe_id: recipeId,
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

    likeRecipe = async (userId: number, recipeId: number): Promise<void> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const isExists = await this.authRepository.isExistsById(conn, userId);
            if (isExists === false) throw new NotFoundException(`이미 탈퇴한 사용자의 토큰입니다.`);

            const findRecipeById = await this.recipeRepository.findRecipeById(conn, recipeId);
            if (!findRecipeById) throw new Error("존재하지 않는 레시피입니다.");

            const existLikeRecipe = await this.recipeRepository.existLikeRecipeById(conn, userId, recipeId);
            if (existLikeRecipe) throw new Error("이미 좋아요 누른 레피시입니다.");

            await this.recipeRepository.likeRecipe(conn, userId, recipeId);

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };

    dislikeRecipe = async (userId: number, recipeId: number): Promise<void> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const isExists = await this.authRepository.isExistsById(conn, userId);
            if (isExists === false) throw new NotFoundException(`이미 탈퇴한 사용자의 토큰입니다.`);

            const findRecipeById = await this.recipeRepository.findRecipeById(conn, recipeId);
            if (!findRecipeById) throw new Error("존재하지 않는 레시피입니다.");

            const existDislikeRecipe = await this.recipeRepository.existLikeRecipeById(conn, userId, recipeId);

            if (!existDislikeRecipe) throw new Error("좋아요 누른 레피시가 아닙니다.");
            await this.recipeRepository.disRecipe(conn, userId, recipeId);

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };
}
