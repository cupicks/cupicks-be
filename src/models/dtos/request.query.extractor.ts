import { ParsedQs } from "qs";

export class RequestQueryExtractor<T> {
    protected validateType(value: string | string[] | ParsedQs | ParsedQs[] | undefined, target: T): string {
        if (value === undefined) throw new Error(`Query 의 ${target} 은 undefined 이여서는 안됩니다.`);
        else if (typeof value === "string") return value;
        else throw new Error(`Query 의 ${target} 인자의 형태가 이상합니다. ${JSON.stringify(value)}`);
    }

    protected validateTypeOrUndefined(
        value: string | string[] | ParsedQs | ParsedQs[] | undefined,
        target: T,
    ): string | undefined {
        if (value === undefined) return undefined;
        else if (typeof value === "string") return value;
        else throw new Error(`Query 의 ${target} 인자의 형태가 이상합니다. ${JSON.stringify(value)}`);
    }
}
