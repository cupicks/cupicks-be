import { RankingRepository, RecipeRepository, RecipeIngredientRepository } from "../repositories/_.exporter";

import { MysqlProvider, DayjsProvider } from "../../modules/_.loader";
import {
    IWeeklyBestPacket,
    IBestRecipePacket,
    IBestRecipeCategoryPacket,
    IRecipeIngredientPacket,
    IRecipeLikePacket,
    IIngredientDto,
    BestRecipeDto,
} from "../../models/_.loader";

export class RankingService {
    private rankingRepository: RankingRepository;
    private recipeRepository: RecipeRepository;
    private recipeIngredientRepository: RecipeIngredientRepository;
    private mysqlProvider: MysqlProvider;
    private dayjsProvider: DayjsProvider;

    constructor() {
        this.rankingRepository = new RankingRepository();
        this.recipeRepository = new RecipeRepository();
        this.recipeIngredientRepository = new RecipeIngredientRepository();
        this.mysqlProvider = new MysqlProvider();
        this.dayjsProvider = new DayjsProvider();
    }

    public getWeeklyBestRecipesByLike = async (bestRecipeDto: BestRecipeDto) => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            // 사용자 좋아요 유무 구분

            const myLikeRecipeIds: IRecipeLikePacket[] = await this.recipeRepository.getMyLikeRecipeIds(
                conn,
                bestRecipeDto.userId,
            );

            const myLikeRecipeIdList = [];

            for (const value of myLikeRecipeIds) {
                myLikeRecipeIdList.push(value.recipeId);
            }

            // 베스트 랭킹 조회

            const period = await this.dayjsProvider.getWeeklyPeriodDate();

            const weeklyBestRecipe: IWeeklyBestPacket[] = await this.rankingRepository.getWeeklyBestRecipesByLike(
                conn,
                period.startDate,
                period.endDate,
            );

            const weeklyBestRankingList: number[] = weeklyBestRecipe.map((value) => value.recipeId);

            console.log(weeklyBestRankingList);

            const bestRecipeList: IBestRecipePacket[][] = await Promise.all(
                weeklyBestRankingList.map(
                    async (recipeId) => await this.rankingRepository.getBestRecipes(conn, recipeId),
                ),
            );

            const bestRecipeIngredientList: IRecipeIngredientPacket[][] = await Promise.all(
                weeklyBestRankingList.map(
                    async (recipeId) =>
                        await this.recipeIngredientRepository.getRecipeIngredientsByRecipeid(conn, recipeId),
                ),
            );

            const bestRecipeCategoryList: IBestRecipeCategoryPacket[][] = await Promise.all(
                weeklyBestRankingList.map(
                    async (recipeId) => await this.rankingRepository.getBestRecipeCategory(conn, recipeId),
                ),
            );

            const bestRecipes = [];

            for (let i = 0; i < weeklyBestRankingList.length; i++) {
                const bestRecipe = {
                    recipeId: bestRecipeList[i][0].recipeId,
                    title: bestRecipeList[i][0].title,
                    content: bestRecipeList[i][0].content,
                    isIced: bestRecipeList[i][0].isIced,
                    cupSize: bestRecipeList[i][0].cupSize,
                    nickname: bestRecipeList[i][0].nickname,
                    imageUrl: bestRecipeList[i][0].imageUrl,
                    resizedUrl: bestRecipeList[i][0].resizedUrl,
                    isLiked: myLikeRecipeIdList.includes(bestRecipeList[i][0].recipeId) ? true : false,
                    likeTotal: weeklyBestRecipe[i].totalLike,
                    ingredientList: bestRecipeIngredientList[i].map((ingredient): IIngredientDto => {
                        return {
                            ingredientName: ingredient.ingredientName,
                            ingredientColor: ingredient.ingredientColor,
                            ingredientAmount: ingredient.ingredientAmount,
                        };
                    }),
                    categoryList: bestRecipeCategoryList[i].map((category) => category.categoryName),
                };
                bestRecipes.push(bestRecipe);
            }

            // // 베스트 랭킹 삽입

            // const weeklyStartDate = period.startDate;
            // const weeklyEndDate = period.endDate;

            // const createBestRecipeRanking = await weeklyBestRankingList.map(async (recipeId, ranking) => {
            //     await this.rankingRepository.createBestRecipeRanking(
            //         conn,
            //         3,
            //         recipeId,
            //         weeklyStartDate,
            //         weeklyEndDate,
            //         "weekly",
            //     )
            // });

            await conn.commit();

            return bestRecipes;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };
}
