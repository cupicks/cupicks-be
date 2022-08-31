import { TNODE_ENV } from "constants/types/t.node.env";
import { TALGORITHM } from "constants/_.lodaer";

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

function getEnvLiteralTypeValue<T extends TALGORITHM>(KEY: string) {
    //     const VALUE = process.env[KEY];
    //     if (VALUE === undefined) throw new Error(`${KEY} 는 undefined 일 수 없습니다.`);
}

export { getNodeEnvValue, getEnvStringValue, getEnvNumberValue, getEnvLiteralTypeValue };
