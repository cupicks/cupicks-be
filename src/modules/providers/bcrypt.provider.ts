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

    public hashPassword(inputPassword: string): string {
        this.validateIsInit();

        try {
            return bcrypt.hashSync(inputPassword, BcryptProvider.SALT);
        } catch (err) {
            throw this.errorHandler(err);
        }
    }

    public async comparedPassword(inputPassword: string, existPassword: string): Promise<boolean> {
        this.validateIsInit();

        console.log(inputPassword, existPassword);

        try {
            return await bcrypt.compare(inputPassword, existPassword);
        } catch (err) {
            throw this.errorHandler(err);
        }
    }

    private validateIsInit = (): void => {
        if (BcryptProvider.isInit === false) throw new Error("BcryptProvider는 init 전 사용할 수 없어요.");
    };

    public errorHandler = (err: unknown): CustomException => {
        if (err instanceof CustomException) return err;
        else if (err instanceof Error) return new ForBiddenException(err.message, "BCRYPT_HASH_COMPARE_FAIL");
        else return new UnkownTypeError(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
    };
}
