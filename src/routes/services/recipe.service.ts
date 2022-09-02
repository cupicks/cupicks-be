import { CreateRecipeDto } from "../../models/_.loader";
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

            const value = await Promise.all([createRecipeIngredient, createRecipe]);

            await conn.commit();
            return value[0];
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };
}
