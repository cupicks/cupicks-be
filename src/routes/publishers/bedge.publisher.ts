import { EArchivementCode, EBedgeCode } from "../../models/enums/_.exporter";
import { DayjsProvider, MysqlProvider } from "../../modules/_.loader";
import { ArchivementRepository, BedgeRepsitory } from "../repositories/_.exporter";

/**
 * 모든 archivement는 서로 다른 수의 bedge를 발행하는 조건이 됩니다.
 * 이 클래스는 archivement를 제어하고 bedge를 발행할 Publisher 입니다.
 *
 * arcvhiment_list :  ~/src/models/e.archivment.code.ts
 * bedge_list : ~/src/models/e.bedge.code.ts
 */
export class BedgePublisher {
    private mysqlProvider: MysqlProvider;
    private dayjsProvider: DayjsProvider;
    private archivementRepository: ArchivementRepository;
    private bedgeRepository: BedgeRepsitory;

    constructor() {
        this.mysqlProvider = new MysqlProvider();
        this.dayjsProvider = new DayjsProvider();

        this.archivementRepository = new ArchivementRepository();
        this.bedgeRepository = new BedgeRepsitory();
    }

    public async handleActRecipeCount(userId: number): Promise<void> {
        const conn = await this.mysqlProvider.getConnection();

        try {
            /*
             * 이 부분은 Archivement 와 Bedge 를 위한 기능입니다.
             * 유저 관점에서 비즈니스 로직의 핵심 요소는 아니기 때문에, 추후 Lambda 로 추출할 생각입니다.
             */
            const isExistsArchviementRow = await this.archivementRepository.isExistsActRecipeCount(conn, userId);
            const dbDatetime = this.dayjsProvider.changeToProvidedFormat(
                this.dayjsProvider.getDayjsInstance(),
                this.dayjsProvider.getDayabaseFormat(),
            );

            const findedArchivementRow = await this.archivementRepository.findActRecipeCount(conn, userId);
            if (isExistsArchviementRow)
                await this.archivementRepository.increaseActRecipeCount(
                    conn,
                    userId,
                    EArchivementCode.레시피_작성_수,
                    dbDatetime,
                );
            else
                await this.archivementRepository.createActRecipeCount(
                    conn,
                    userId,
                    EArchivementCode.레시피_작성_수,
                    dbDatetime,
                );

            const { archivementCount } = findedArchivementRow;
            if (archivementCount >= 3) {
                const bedge = await this.bedgeRepository.findSingleBedgeByUserId(
                    conn,
                    userId,
                    EBedgeCode["3RD_ACT_RECIPE"],
                );
                if (bedge === null)
                    await this.bedgeRepository.publishBedge(conn, userId, EBedgeCode["3RD_ACT_RECIPE"], dbDatetime);
            } else if (archivementCount >= 1) {
                const bedge = await this.bedgeRepository.findSingleBedgeByUserId(
                    conn,
                    userId,
                    EBedgeCode["1ST_ACT_RECIPE"],
                );
                if (bedge === null)
                    await this.bedgeRepository.publishBedge(conn, userId, EBedgeCode["1ST_ACT_RECIPE"], dbDatetime);
            }
        } catch (err) {
            throw err;
        }
    }

    public async handleActCommentCount(userId: number): Promise<void> {
        const conn = await this.mysqlProvider.getConnection();

        try {
            /*
             * 이 부분은 Archivement 와 Bedge 를 위한 기능입니다.
             * 유저 관점에서 비즈니스 로직의 핵심 요소는 아니기 때문에, 추후 Lambda 로 추출할 생각입니다.
             */
            const isExistsArchviementRow = await this.archivementRepository.isExistsActCommentCount(conn, userId);
            const dbDatetime = this.dayjsProvider.changeToProvidedFormat(
                this.dayjsProvider.getDayjsInstance(),
                this.dayjsProvider.getDayabaseFormat(),
            );

            const findedArchivementRow = await this.archivementRepository.findActCommentCount(conn, userId);
            console.log(findedArchivementRow);

            if (isExistsArchviementRow)
                await this.archivementRepository.increaseActCommentCount(
                    conn,
                    userId,
                    EArchivementCode.댓글_작성_수,
                    dbDatetime,
                );
            else
                await this.archivementRepository.createActCommentCount(
                    conn,
                    userId,
                    EArchivementCode.댓글_작성_수,
                    dbDatetime,
                );

            const { archivementCount } = findedArchivementRow;
            if (archivementCount >= 3) {
                const bedge = await this.bedgeRepository.findSingleBedgeByUserId(
                    conn,
                    userId,
                    EBedgeCode["3RD_ACT_COMMENT"],
                );
                if (bedge === null)
                    await this.bedgeRepository.publishBedge(conn, userId, EBedgeCode["3RD_ACT_COMMENT"], dbDatetime);
            } else if (archivementCount >= 1) {
                const bedge = await this.bedgeRepository.findSingleBedgeByUserId(
                    conn,
                    userId,
                    EBedgeCode["1ST_ACT_COMMENT"],
                );
                if (bedge === null)
                    await this.bedgeRepository.publishBedge(conn, userId, EBedgeCode["1ST_ACT_COMMENT"], dbDatetime);
            }
        } catch (err) {
            throw err;
        }
    }
}
