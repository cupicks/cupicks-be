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

            const createRecipeIngredient = await this.recipeRepository.createRecipeIngredient(
                conn,
                recipeId,
                recipeDto.ingredientList[0].ingredientName,
                recipeDto.ingredientList[0].ingredientColor,
                recipeDto.ingredientList[0].ingredientAmount,
            );

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };
}
