import { CreateRecipeDto, UpdateRecipeDto } from "../../models/_.loader";
import { RecipeRepository } from "../repositories/_.exporter";
import { MysqlProvider } from "../../modules/_.loader";

export class RecipeService {
    private recipeRepository: RecipeRepository;
    private mysqlProvider: MysqlProvider;

    constructor() {
        this.recipeRepository = new RecipeRepository();
        this.mysqlProvider = new MysqlProvider();
    }

    createRecipe = async (recipeDto: CreateRecipeDto, userId: number): Promise<any> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const recipdId: number = await this.recipeRepository.createRecipe(conn, recipeDto);

            const result = recipeDto.ingredientList.map((e) => {
                return {
                    recipe_id: recipdId,
                    ingredient_name: e.ingredientName,
                    ingredient_color: e.ingredientColor,
                    ingredient_amount: e.ingredientAmount,
                };
            });

            const createRecipeIngredient = Promise.resolve(this.recipeRepository.createRecipeIngredient(conn, result));
            const createUserRecipe = Promise.resolve(this.recipeRepository.createUserRecipe(conn, userId, recipdId));

            const [ingredientIdList, userRecipeId]: [createdIngredientId: number[], createdUserRecipeId: string] =
                await Promise.all([createRecipeIngredient, createUserRecipe]);

            this.recipeRepository.createRecipeIngredientList(conn, recipdId, ingredientIdList);

            await conn.commit();
            return recipdId;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            await conn.release();
        }
    };

    getRecipe = async (recipeId: number): Promise<any> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();
            const findRecipeById = (await this.recipeRepository.findRecipeById(conn, recipeId)) as Array<object>;

            if (findRecipeById.length <= 0) throw new Error("존재하지 않는 레시피입니다.");

            const getRecipe = await this.recipeRepository.getRecipe(conn, recipeId);

            await conn.commit();

            return getRecipe;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            await conn.release();
        }
    };

    getRecipes = async (page: number, count: number): Promise<any> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const getRecipesOne = await this.recipeRepository.getRecipes(conn, count);

            await conn.commit();
            return getRecipesOne;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            await conn.release();
        }
    };

    deleteRecipe = async (recipeId: number, userId: number): Promise<boolean | undefined> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const isAuthenticated = await this.recipeRepository.isAuthenticated(conn, recipeId, userId);

            if (isAuthenticated.length <= 0) return false;

            const deleteRecipe = await this.recipeRepository.deleteRecipe(conn, recipeId);

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            await conn.release();
        }
    };

    updateRecipe = async (updateRecipeDto: UpdateRecipeDto, recipeId: number, userId: number): Promise<boolean> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const isAuthenticated = await this.recipeRepository.isAuthenticated(conn, recipeId, userId);

            if (isAuthenticated.length <= 0) return false;

            const updateRecipe = Promise.resolve(this.recipeRepository.updateRecipe(conn, updateRecipeDto, recipeId));
            const deleteRecipeIngredient = Promise.resolve(
                this.recipeRepository.deleteRecipeIngredient(conn, recipeId),
            );

            await Promise.all([updateRecipe, deleteRecipeIngredient]);

            const result = updateRecipeDto.ingredientList.map((e) => {
                return {
                    recipe_id: recipeId,
                    ingredient_name: e.ingredientName,
                    ingredient_color: e.ingredientColor,
                    ingredient_amount: e.ingredientAmount,
                };
            });

            const updateRecipeIngredient = await this.recipeRepository.createRecipeIngredient(conn, result);

            await conn.commit();
            return true;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            await conn.release();
        }
    };

    likeRecipe = async (userId: number, recipeId: number): Promise<boolean> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const findRecipeById = (await this.recipeRepository.findRecipeById(conn, recipeId)) as Array<object>;

            if (findRecipeById.length <= 0) throw new Error("존재하지 않는 레시피입니다.");

            const existLikeRecipe = (await this.recipeRepository.existLikeRecipeById(
                conn,
                userId,
                recipeId,
            )) as Array<object>;

            // 서비스에서 에러를 던지자
            if (existLikeRecipe.length >= 1) throw new Error("이미 좋아요 누른 레시피입니다.");

            const likeRecipe = await this.recipeRepository.likeRecipe(conn, userId, recipeId);

            await conn.commit();

            return likeRecipe;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            await conn.release();
        }
    };

    dislikeRecipe = async (userId: number, recipeId: number): Promise<boolean> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const findRecipeById = (await this.recipeRepository.findRecipeById(conn, recipeId)) as Array<object>;

            if (findRecipeById.length <= 0) throw new Error("존재하지 않는 레시피입니다.");

            const existDislikeRecipe = (await this.recipeRepository.existLikeRecipeById(
                conn,
                userId,
                recipeId,
            )) as Array<object>;

            // 서비스에서 에러를 던지자
            if (existDislikeRecipe.length <= 0) throw new Error("내가 좋아요 한 레시피가 아닙니다.");

            const dislikeRecipe = await this.recipeRepository.disRecipe(conn, userId, recipeId);

            return dislikeRecipe;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            await conn.release();
        }
    };
}
