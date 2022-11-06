import { RowDataPacket } from "mysql2/promise";

import { EArchivementCode } from "../enums/_.exporter";

export interface IArchivementPacket extends RowDataPacket {
    userId: number;
    archivementName: EArchivementCode;
    archivementCount: number;
    archivementDate: string;
}
