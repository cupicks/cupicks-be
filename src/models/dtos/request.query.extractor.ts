import { ParsedQs } from "qs";
import { BadRequestException } from "../../models/_.loader";

export class RequestQueryExtractor<T> {
    /**
     * req.query 로부터 다음을 추출합니다.
     *
     * 1. string
     */
    protected getStringFromQuery(value: string | string[] | ParsedQs | ParsedQs[] | undefined, target: T): string {
        if (value === undefined) throw new BadRequestException(`Query 의 ${target} 은 undefined 이여서는 안됩니다.`);
        else if (typeof value === "string") return value;
        else throw new BadRequestException(`Query 의 ${target} 인자의 형태가 이상합니다. ${JSON.stringify(value)}`);
    }

    /**
     * req.query 로부터 다음을 추출합니다.
     *
     * 1. string
     * 2. undefined
     */
    protected getStringOrUndefinedFromQuery(
        value: string | string[] | ParsedQs | ParsedQs[] | undefined,
        target: T,
    ): string | undefined {
        if (value === undefined) return undefined;
        else if (typeof value === "string") return value;
        else throw new BadRequestException(`Query 의 ${target} 인자의 형태가 이상합니다. ${JSON.stringify(value)}`);
    }

    /**
     * req.query 로부터 다음을 추출합니다.
     *
     * 1. 중복이 허용된 string[]
     */
    protected getStringArrayFromQuery(
        value: string | string[] | ParsedQs | ParsedQs[] | undefined,
        target: T,
    ): string[] {
        if (value === undefined) throw new BadRequestException(`Query 의 ${target} 은 undefined 이여서는 안됩니다.`);
        else if (typeof value === "string") return value.split(",").filter((v) => v);
        else throw new BadRequestException(`Query 의 ${target} 인자의 형태가 이상합니다. ${JSON.stringify(value)}`);
    }

    /**
     * req.query 로부터 다음을 추출합니다.
     *
     * 1. 중복이 허용된 string[]
     * 2. undefined
     */
    protected getStringArrayOrUndefinedFromQuery(
        value: string | string[] | ParsedQs | ParsedQs[] | undefined,
        target: T,
    ): string[] | undefined {
        if (value === undefined) return undefined;
        else if (typeof value === "string") return value.split(",").filter((v) => v);
        else throw new BadRequestException(`Query 의 ${target} 인자의 형태가 이상합니다. ${JSON.stringify(value)}`);
    }

    /**
     * req.query 로부터 다음을 추출합니다.
     *
     * 1. 중복이 배제된 string[]
     */
    protected getStringSetFromQuery(value: string | string[] | ParsedQs | ParsedQs[] | undefined, target: T): string[] {
        if (value === undefined) throw new BadRequestException(`Query 의 ${target} 은 undefined 이여서는 안됩니다.`);
        else if (typeof value === "string") return [...new Set(value.split(",").filter((v) => v))];
        else throw new BadRequestException(`Query 의 ${target} 인자의 형태가 이상합니다. ${JSON.stringify(value)}`);
    }

    /**
     * req.query 로부터 다음을 추출합니다.
     *
     * 1. 중복이 배제된 string[]
     * 2. undefined
     */
    protected getStringSetOrUndefinedFromQuery(
        value: string | string[] | ParsedQs | ParsedQs[] | undefined,
        target: T,
    ): string[] | undefined {
        if (value === undefined) return undefined;
        else if (typeof value === "string") return [...new Set(value.split(",").filter((v) => v))];
        else throw new BadRequestException(`Query 의 ${target} 인자의 형태가 이상합니다. ${JSON.stringify(value)}`);
    }

    /** @deprecated */
    protected validateType(value: string | string[] | ParsedQs | ParsedQs[] | undefined, target: T): string {
        if (value === undefined) throw new BadRequestException(`Query 의 ${target} 은 undefined 이여서는 안됩니다.`);
        else if (typeof value === "string") return value;
        else throw new BadRequestException(`Query 의 ${target} 인자의 형태가 이상합니다. ${JSON.stringify(value)}`);
    }

    /** @deprecated */
    protected validateTypeOrUndefined(
        value: string | string[] | ParsedQs | ParsedQs[] | undefined,
        target: T,
    ): string | undefined {
        if (value === undefined) return undefined;
        else if (typeof value === "string") return value;
        else throw new BadRequestException(`Query 의 ${target} 인자의 형태가 이상합니다. ${JSON.stringify(value)}`);
    }
}
