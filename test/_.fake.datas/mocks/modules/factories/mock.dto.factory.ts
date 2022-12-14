import { SigninUserDto, SignupUserDto } from "../../../../../src/models/_.loader";
import { UserDtoFixtureProvider } from "../../../../_.fake.datas/fixture/user.dto.fixture.provider";

const userDtoFixtureProvider = new UserDtoFixtureProvider();

export const MockDtoFactory = {
    getSignupUserDto: jest.fn(),
    getSigninUserDto: jest.fn(),
    getLogoutUserDto: jest.fn(),
    getPublishTokenDto: jest.fn(),
    getConfirmEmailDto: jest.fn(),
    getConfirmNicknameDto: jest.fn(),
    getSendPasswordDto: jest.fn(),
    getResetPasswordDto: jest.fn(),
    getSendEmailDto: jest.fn(),
    getEditProfileDto: jest.fn(),
    getGetMyRecipeDto: jest.fn(),
    getGetLikeRecipeDto: jest.fn(),
    getCreateRecipeDto: jest.fn(),
    getUpdateRecipeDto: jest.fn(),
    getIngredientDto: jest.fn(),
    getCommonRecipeDto: jest.fn(),
    getDeleteRecipeDto: jest.fn(),
    getGetRecipeDto: jest.fn(),
    getRecipeDto: jest.fn(),
    getIRecipeDto: jest.fn(),
    getCreateCommentDto: jest.fn(),
    getDeleteCommentDto: jest.fn(),
    getUpdateCommentDto: jest.fn(),
    getGetCommentDto: jest.fn(),
};
