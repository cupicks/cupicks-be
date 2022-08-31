import * as joi from "joi";
import { IBaseDto } from "models/_.loader";

export class JoiValidator {
    public async validateAsync<T extends IBaseDto>(anyDto: IBaseDto): Promise<T> {
        return await anyDto.getJoiInstance().validateAsync(anyDto);
    }
}
