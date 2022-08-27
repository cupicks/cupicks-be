import "dotenv/config";


export default class Env {

    PORT;

    constructor() {
        this.PORT = this.getEnvStringValue("PORT");
    }

    private getEnvStringValue(KEY: string): string {
        const VALUE = process.env[KEY];
        if (VALUE === undefined) throw new Error(`${KEY} 는 undefined 일 수 없습니다.`);

        return VALUE;
    }

    private getEnvNumberValue(KEY: string): number {
        const VALUE = process.env[KEY];
        if (VALUE === undefined) throw new Error(`${KEY} 는 undefined 일 수 없습니다.`);

        const NUMBER_VALUE = +VALUE;
        const isNumber = !isNaN(NUMBER_VALUE);
        if (isNumber === false) throw new Error(`${KEY} 는 string 일 수 없습니다.`);

        return NUMBER_VALUE;
    }

}