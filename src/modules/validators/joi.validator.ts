import { CustomException, IBaseDto, UnkownTypeError, ValidationException } from "../../models/_.loader";

export class JoiValidator {
    public async validateAsync<T extends IBaseDto>(anyDto: IBaseDto): Promise<T> {
        try {
            return await anyDto.getJoiInstance().validateAsync(anyDto);
        } catch (err) {
            throw this.errorHandler(err);
        }
    }

    private errorHandler = (err: unknown): CustomException => {
        if (err instanceof CustomException) return err;
        else if (err instanceof Error) return new ValidationException(err.message, "REQUEST_VALIDATION_FAIL");
        else return new UnkownTypeError(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
    };
}
