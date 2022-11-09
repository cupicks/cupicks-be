import { RowDataPacket } from "mysql2/promise";

import { EBadgeCode } from "../enums/_.exporter";

export interface IBedgePacket extends RowDataPacket {
    userId: number;
    bedgeName: EBadgeCode;
    createdAt: string;
}
