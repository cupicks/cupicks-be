import * as fs from "fs";
import * as path from "path";
import { TALGORITHM, TNODE_ENV } from "../../../constants/_.loader";

function getNodeEnvValue(KEY: string): TNODE_ENV {
    const VALUE = process.env[KEY];
    if (VALUE === undefined) throw new Error(`${KEY} 는 undefined 일 수 없습니다.`);
    if (VALUE !== "dev" && VALUE !== "test" && VALUE !== "prod")
        throw new Error(`${KEY} 는 dev prod test 이여야 합니다.`);

    return VALUE;
}

function getEnvStringValue(KEY: string): string {
    const VALUE = process.env[KEY];
    if (VALUE === undefined) throw new Error(`${KEY} 는 undefined 일 수 없습니다.`);

    return VALUE;
}

function getEnvNumberValue(KEY: string): number {
    const VALUE = process.env[KEY];
    if (VALUE === undefined) throw new Error(`${KEY} 는 undefined 일 수 없습니다.`);

    const NUMBER_VALUE = +VALUE;
    const isNumber = !isNaN(NUMBER_VALUE);
    if (isNumber === false) throw new Error(`${KEY} 는 string 일 수 없습니다.`);

    return NUMBER_VALUE;
}

function getPemKey(KEY: "private" | "public"): string {
    const pemKey = fs.readFileSync(path.join(process.cwd(), `${KEY}.pem`), "utf8");

    return pemKey;
}

function getEnvLiteralTypeValue<T extends TALGORITHM>(KEY: string) {
    const VALUE = process.env[KEY];
    if (VALUE === undefined) throw new Error(`${KEY} 는 undefined 일 수 없습니다.`);

    const VALUE_TARGETS: TALGORITHM[] = [
        "HS256",
        "HS384",
        "HS512",
        "RS256",
        "RS384",
        "RS512",
        "ES256",
        "ES384",
        "ES512",
        "PS256",
        "PS384",
        "PS512",
    ];
    const TYPED_VALUE = VALUE_TARGETS.find((v) => v === VALUE);
    if (TYPED_VALUE === undefined) throw new Error(`${KEY} 는 리터럴 타입이어야 합니다. 오탈자를 확인해주세요.`);

    return TYPED_VALUE;
}

export { getNodeEnvValue, getEnvStringValue, getEnvNumberValue, getEnvLiteralTypeValue, getPemKey };
