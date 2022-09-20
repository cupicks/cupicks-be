import { JoiValidator } from "../../src/modules/validators/joi.validator";
import {
    SignupUserDto,
    SigninUserDto,
    LogoutUserDto,
    PublishTokenDto,
    ConfirmEmailDto,
    ConfirmNicknameDto,
    SendPasswordDto,
    ResetPasswordDto,
    SendEmailDto,
} from "../../src/models/_.loader";
import { RequestQueryExtractor } from "../../src/models/dtos/request.query.extractor";
import { UserDtoFixtureProvider } from "../_.fake.datas/fixture/user.dto.fixture.provider";
/**
 * 유효성 검증 시스템의 참여자는 다음과 같습니다.
 *
 * 1. JoiValidator
 * 2. **Dto extedns ReqeuestQueryExtractor implments IBaseDto, I**Dto
 */
describe("VallidateSystem's using JoiValidator and **Dto", () => {
    /** JoiValidator, SignupUserDto 는 무조건 정의 되어야 합니다. */
    it("JoiValidator must be defined", () => expect(JoiValidator).toBeDefined());

    /**
     * JoiValidator 는 **Dto.prototype.getJoiInstance 를 호출합니다.
     * 이를 통해서 얻은 joi.ObjectSchema<**Dto> 를 이용해서 유효성 검증을 진행합니다.
     *
     * - 성공 시, **Dto 를 그대로 리턴합니다.
     * - 실패 시, Error 를 발생시킵니다.
     */
    // describe("All Dtos is could interact JoiValidator", () => {
    //     let fixtureProvider: UserDtoFixtureProvider;
    //     let sutValidator: JoiValidator;
    //     beforeAll(() => {
    //         fixtureProvider = new UserDtoFixtureProvider();
    //         sutValidator = new JoiValidator();
    //     });

    //     it("1. SignupUserDto", async () => {
    //         const sutDto = fixtureProvider.getSignupUserDto();
    //         jest.spyOn(sutDto, "getJoiInstance");

    //         const validatedSutDto = await sutValidator.validateAsync(sutDto);
    //         expect(validatedSutDto).toBeInstanceOf(SignupUserDto);
    //         expect(validatedSutDto).toBeInstanceOf(RequestQueryExtractor);

    //         expect(sutDto.getJoiInstance).toBeCalled();
    //         expect(sutDto.getJoiInstance).toBeCalledTimes(1);
    //     });

    //     it("2. SigninUserDto", async () => {
    //         const sutDto = fixtureProvider.getSigninUserDto();
    //         jest.spyOn(sutDto, "getJoiInstance");

    //         const validatedSutDto = await sutValidator.validateAsync(sutDto);
    //         expect(validatedSutDto).toBeInstanceOf(SigninUserDto);
    //         expect(validatedSutDto).toBeInstanceOf(RequestQueryExtractor);

    //         expect(sutDto.getJoiInstance).toBeCalled();
    //         expect(sutDto.getJoiInstance).toBeCalledTimes(1);
    //     });

    //     it("3. LogoutUserDto", async () => {
    //         const sutDto = fixtureProvider.getLogoutUserDto();
    //         jest.spyOn(sutDto, "getJoiInstance");

    //         const validatedSutDto = await sutValidator.validateAsync(sutDto);
    //         expect(validatedSutDto).toBeInstanceOf(LogoutUserDto);
    //         expect(validatedSutDto).toBeInstanceOf(RequestQueryExtractor);

    //         expect(sutDto.getJoiInstance).toBeCalled();
    //         expect(sutDto.getJoiInstance).toBeCalledTimes(1);
    //     });

    //     it("4. PublishTokenDto", async () => {
    //         const sutDto = fixtureProvider.getPublishTokenDto();
    //         jest.spyOn(sutDto, "getJoiInstance");

    //         const validatedSutDto = await sutValidator.validateAsync(sutDto);
    //         expect(validatedSutDto).toBeInstanceOf(PublishTokenDto);
    //         expect(validatedSutDto).toBeInstanceOf(RequestQueryExtractor);

    //         expect(sutDto.getJoiInstance).toBeCalled();
    //         expect(sutDto.getJoiInstance).toBeCalledTimes(1);
    //     });

    //     it("5. ConfirmEmailDto", async () => {
    //         const sutDto = fixtureProvider.getConfirmEmailDto();
    //         jest.spyOn(sutDto, "getJoiInstance");

    //         const validatedSutDto = await sutValidator.validateAsync(sutDto);

    //         expect(validatedSutDto).toBeInstanceOf(ConfirmEmailDto);
    //         expect(validatedSutDto).toBeInstanceOf(RequestQueryExtractor);

    //         expect(sutDto.getJoiInstance).toBeCalled();
    //         expect(sutDto.getJoiInstance).toBeCalledTimes(1);
    //     });

    //     it("6. ConfirmNicknameDto", async () => {
    //         const sutDto = fixtureProvider.getConfirmNicknameDto();
    //         jest.spyOn(sutDto, "getJoiInstance");

    //         const validatedSutDto = await sutValidator.validateAsync(sutDto);
    //         expect(validatedSutDto).toBeInstanceOf(ConfirmNicknameDto);
    //         expect(validatedSutDto).toBeInstanceOf(RequestQueryExtractor);

    //         expect(sutDto.getJoiInstance).toBeCalled();
    //         expect(sutDto.getJoiInstance).toBeCalledTimes(1);
    //     });

    //     it("7. SendPasswordDto", async () => {
    //         const sutDto = fixtureProvider.getSendPasswordDto();
    //         jest.spyOn(sutDto, "getJoiInstance");

    //         const validatedSutDto = await sutValidator.validateAsync(sutDto);
    //         expect(validatedSutDto).toBeInstanceOf(SendPasswordDto);
    //         expect(validatedSutDto).toBeInstanceOf(RequestQueryExtractor);

    //         expect(sutDto.getJoiInstance).toBeCalled();
    //         expect(sutDto.getJoiInstance).toBeCalledTimes(1);
    //     });

    //     it("8. ResetPasswordDto", async () => {
    //         const sutDto = fixtureProvider.getResetPasswordDto();
    //         jest.spyOn(sutDto, "getJoiInstance");

    //         const validatedSutDto = await sutValidator.validateAsync(sutDto);
    //         expect(validatedSutDto).toBeInstanceOf(ResetPasswordDto);
    //         expect(validatedSutDto).toBeInstanceOf(RequestQueryExtractor);

    //         expect(sutDto.getJoiInstance).toBeCalled();
    //         expect(sutDto.getJoiInstance).toBeCalledTimes(1);
    //     });

    //     it("9. SendEmailDto", async () => {
    //         const sutDto = fixtureProvider.getSendEmailDto();
    //         jest.spyOn(sutDto, "getJoiInstance");

    //         const validatedSutDto = await sutValidator.validateAsync(sutDto);
    //         expect(validatedSutDto).toBeInstanceOf(SendEmailDto);
    //         expect(validatedSutDto).toBeInstanceOf(RequestQueryExtractor);

    //         expect(sutDto.getJoiInstance).toBeCalled();
    //         expect(sutDto.getJoiInstance).toBeCalledTimes(1);
    //     });

    //     afterEach(() => {
    //         jest.clearAllMocks();
    //     });
    // });
});
