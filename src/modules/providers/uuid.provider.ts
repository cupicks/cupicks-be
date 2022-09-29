// v1: 타임스탬프(시간) 기준 ㅡ> 시간과 MAC 주소를 추측할 수 있으므로 보안상 취약
// v3: MD5 해시 기준
// v4: 랜덤값 기반
// v5: SHA-1 해시 기준

import { v4 as uuid, V4Options } from "uuid";
import { DayjsProvider } from "../_.loader";

type TGetUuid = string;

/**
 * @deprecated
 */
const v4Options: V4Options = {
    // Array 16개의 임의바이트 랜덤
    random: [0x10, 0x91, 0x56, 0xbe, 0xc4, 0xfb, 0xc1, 0xea, 0x71, 0xb4, 0xef, 0xe1, 0x67, 0x1c, 0x58, 0x36],
};

export class UuidProvider {
    public getUuid(): TGetUuid {
        const dateFormat = new DayjsProvider().getDayabaseFormat();
        const imageFileName = uuid().split("-")[0] + uuid().split("-")[1] + uuid().split("-")[2] + uuid().split("-")[3];

        return imageFileName;
    }
}
