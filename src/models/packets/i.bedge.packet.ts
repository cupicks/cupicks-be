import { RowDataPacket } from "mysql2/promise";

import { EBedgeCode } from "../enums/_.exporter";

export interface IBedgePacket extends RowDataPacket {
    userId: number;
    bedgeName: EBedgeCode;
    createdAt: string;
}
