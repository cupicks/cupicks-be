import * as bcrypt from "bcrypt";
import { ForBiddenException, CustomException, UnkownTypeError } from "../../models/_.loader";

export class BcryptProvider {
    // property
    static isInit = false;
    static SALT: number;

    static init(SALT: number) {
        if (this.isInit === true) return;
        this.SALT = SALT;
        this.isInit = true;
    }

    public hashPassword(inputPassword: string) {
        this.validateIsInit();

        try {
            return bcrypt.hashSync(inputPassword, BcryptProvider.SALT);
        } catch (err) {
            throw this.errorHandler(err);
        }
    }

    public comparedPassword(inputPassword: string, existPassword: string) {
        this.validateIsInit();

        try {
            return bcrypt.compare(inputPassword, existPassword);
        } catch (err) {
            throw this.errorHandler(err);
        }
    }

    private validateIsInit = () => {
        if (BcryptProvider.isInit === false) throw new Error("BcryptProvider는 init 전 사용할 수 없어요.");
    };

    public errorHandler = (err: unknown): CustomException => {
        if (err instanceof CustomException) return err;
        else if (err instanceof Error) return new ForBiddenException(err.message);
        else return new UnkownTypeError(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
    };
}
