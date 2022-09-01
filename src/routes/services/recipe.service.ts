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

    createRecipe = async (recipeDto: CreateRecipeDto): Promise<any> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const createRecipe = await this.recipeRepository.createRecipe(conn, recipeDto);
            const recipeId = parseInt(JSON.stringify(createRecipe[0].insertId));

            const result = recipeDto.ingredientList.map((e) => {
                return {
                    recipe_id: recipeId,
                    ingredient_name: e.ingredientName,
                    ingredient_color: e.ingredientColor,
                    ingredient_amount: e.ingredientAmount,
                };
            });

            const createRecipeIngredient = await this.recipeRepository.createRecipeIngredient(conn, result);

            await conn.commit();

            return createRecipeIngredient;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };
}
