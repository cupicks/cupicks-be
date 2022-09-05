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

            const createRecipe = await this.recipeRepository.createRecipe(conn, recipeDto);

            const result = recipeDto.ingredientList.map((e) => {
                return {
                    recipe_id: createRecipe,
                    ingredient_name: e.ingredientName,
                    ingredient_color: e.ingredientColor,
                    ingredient_amount: e.ingredientAmount,
                };
            });

            const createRecipeIngredient = Promise.resolve(this.recipeRepository.createRecipeIngredient(conn, result));
            const createUserRecipe = Promise.resolve(
                this.recipeRepository.createUserRecipe(conn, userId, createRecipe),
            );

            await Promise.all([createRecipeIngredient, createUserRecipe]);

            await conn.commit();
            return createRecipe;
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

    updateRecipe = async (updateRecipeDto: UpdateRecipeDto, recipeId: number, userId: number): Promise<any> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const isAuthenticated = await this.recipeRepository.isAuthenticated(conn, recipeId, userId);

            if (isAuthenticated.length <= 0) return false;

            // const updateRecipe = await this.recipeRepository.updateRecipe
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            await conn.release();
        }
    };
}
