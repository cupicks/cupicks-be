import { RankingRepository } from "../repositories/_.exporter";
import { MysqlProvider, DayjsProvider } from "../../modules/_.loader";

export class RankingService {
    private rankingRepository: RankingRepository;
    private mysqlProvider: MysqlProvider;
    private dayjsProvider: DayjsProvider;

    constructor() {
        this.rankingRepository = new RankingRepository();
        this.mysqlProvider = new MysqlProvider();
        this.dayjsProvider = new DayjsProvider();
    }

    public getWeeklyLikeRecipes = async () => {
        try {
            // const dayjs = await this.dayjsProvider.getDayjsInstance();
        } catch (err) {}
    };
}
