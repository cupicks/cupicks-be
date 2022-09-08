import { JoiValidator } from "../../src/modules/validators/joi.validator";
import { SignupUserDto } from "../../src/models/dtos/user/signup.user.dto";

/**
 * 유효성 검증 시스템의 참여자는 다음과 같습니다.
 *
 * 1. JoiValidator
 * 2. **Dto extedns ReqeuestQueryExtractor implments IBaseDto, I**Dto
 */
describe("VallidateSystem's using JoiValidator and **Dto", () => {
    /** JoiValidator, SignupUserDto 는 무조건 정의 되어야 합니다. */
    it("JoiValidator must be defined", () => expect(JoiValidator).toBeDefined());
    it("SignupUserDto must be defined", () => expect(SignupUserDto).toBeDefined());
});
