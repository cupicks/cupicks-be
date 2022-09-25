// sut
import { AuthService } from "../../../../src/routes/services/auth.service";

import "../../../../src/modules/providers/jwt.provider";
import "../../../../src/modules/providers/aws.ses.provider";
import "../../../../src/modules/providers/mysql.provider";
import "../../../../src/modules/providers/bcrypt.provider";
import "../../../../src/modules/providers/dayjs.provider";
import "../../../../src/modules/generator/random.generator";

import "../../../../src/routes/repositories/auth.repository";
import "../../../../src/routes/repositories/auth.verify.list.repository";
import "../../../../src/routes/repositories/user.category.repository";

import { mockModule, mockRoute } from "../../../_.fake.datas/mocks/_.loader";

jest.mock("../../../../src/modules/providers/jwt.provider", () => {
    return {
        JwtProvider: jest.fn().mockImplementation(() => ({
            signAccessToken: jest.fn(),
            signRefreshToken: jest.fn(),
            signEmailVerifyToken: jest.fn(),
            signNicknameVerifyToken: jest.fn(),
            signResetPasswordToken: jest.fn(),
            decodeToken: jest.fn(),
            verifyToken: jest.fn(),
            extractToken: jest.fn(),
        })),
    };
});
jest.mock("../../../../src/modules/providers/mysql.provider", () => {
    return {
        MysqlProvider: jest.fn().mockImplementation(() => ({
            getConnection: jest.fn(),
        })),
    };
});
jest.mock("../../../../src/modules/providers/aws.ses.provider", () => {
    return {
        AwsSesProvider: jest.fn().mockImplementation(() => ({
            getSesInstance: jest.fn(),
            getRandomSixDigitsVerifiedCode: jest.fn(),
            sendVerifyCode: jest.fn(),
            sendTempPassword: jest.fn(),
        })),
    };
});
jest.mock("../../../../src/modules/providers/bcrypt.provider", () => {
    return {
        BcryptProvider: jest.fn().mockImplementation(() => ({
            hashPassword: jest.fn(),
            comparedPassword: jest.fn(),
        })),
    };
});
jest.mock("../../../../src/modules/providers/dayjs.provider", () => {
    return {
        DayjsProvider: jest.fn().mockImplementation(() => ({
            getDayabaseFormat: jest.fn(),
            getClientFormat: jest.fn(),
            getDayjsInstance: jest.fn(),
            changeToProvidedFormat: jest.fn(),
            getAddTime: jest.fn(),
            getDiffMIlliSeconds: jest.fn(),
        })),
    };
});
jest.mock("../../../../src/modules/generator/random.generator", () => {
    return {
        RandomGenerator: jest.fn().mockImplementation(() => ({
            getRandomPassword: jest.fn(),
            getRandomVerifyCode: jest.fn(),
        })),
    };
});
jest.mock("../../../../src/routes/repositories/auth.repository", () => {
    return {
        AuthRepository: jest.fn().mockImplementation(() => ({
            isExistsByEmailOrNickname: jest.fn(),
            isExistsByEmail: jest.fn(),
            isExistsById: jest.fn(),
            isExistsByNickname: jest.fn(),
            findUserById: jest.fn(),
            findUserByEmail: jest.fn(),
            findUserByNickname: jest.fn(),
            findUserRefreshTokenById: jest.fn(),
            findUserRefreshTokenByIdLegacy: jest.fn(),
            findAllUser: jest.fn(),
            createUser: jest.fn(),
            createUserLegacy: jest.fn(),
            createUserDetailByUserId: jest.fn(),
            createUserRefreshTokenRowByUserId: jest.fn(),
            updateUserProfile: jest.fn(),
            updateUserRefreshToken: jest.fn(),
            updateUserPassword: jest.fn(),
            updateUserResetPassword: jest.fn(),
            exceedOfResetPasswordSent: jest.fn(),
            updateUserRefreshTokenRowByUserId: jest.fn(),
        })),
    };
});
jest.mock("../../../../src/routes/repositories/auth.verify.list.repository", () => {
    return {
        AuthVerifyListRepository: jest.fn().mockImplementation(() => ({
            isExistsbyEmail: jest.fn(),
            isExistsByNicknameExceptEmail: jest.fn(),
            findVerifyListByEmail: jest.fn(),
            createVerifyListByEmailAndCode: jest.fn(),
            updateVerifyListByIdAndCode: jest.fn(),
            updateVerifyListByEmailAndEmailVerifyToken: jest.fn(),
            updateVerifyListByNickname: jest.fn(),
            reUpdateVerifyListByIdAndCode: jest.fn(),
            reUpdateVerifyListByEmailAndEmailVerifyToken: jest.fn(),
            exceedOfEmailSent: jest.fn(),
            disableExceedOfEmailSent: jest.fn(),
        })),
    };
});
jest.mock("../../../../src/routes/repositories/user.category.repository", () => {
    return {
        UserCategoryRepository: jest.fn().mockImplementation(() => ({
            createFavorCategoryList: jest.fn(),
            createDisfavorCategoryList: jest.fn(),
            deleteAllFavorCateogryList: jest.fn(),
            deleteAllDisfavorCateogryList: jest.fn(),
        })),
    };
});

describe("Auth Service Test", () => {
    let sutAuthService: AuthService;

    beforeAll(() => {
        sutAuthService = new AuthService();
    });

    it("AuthService must be defined", () => expect(AuthService).toBeDefined());
});
