import { JoiValidator } from "../../modules/_.loader";
import { ParsedQs } from "qs";

export class DtoFactory {
    private joiValidator: JoiValidator;
    constructor() {
        this.joiValidator = new JoiValidator();
    }

    // USER
    public async getSignupUserDto(iDto: {
        password: string | string[] | ParsedQs | ParsedQs[] | undefined;
        imageUrl: string | undefined;
        resizedUrl: string | undefined;
        nicknameVerifyToken: string | string[] | ParsedQs | ParsedQs[] | undefined;
        emailVerifyToken: string | string[] | ParsedQs | ParsedQs[] | undefined;
    }): Promise<SignupUserDto> {
        return await this.joiValidator.validateAsync<SignupUserDto>(new SignupUserDto(iDto));
    }

    public async getSigninUserDto(iDto: ISigninUserDto): Promise<SigninUserDto> {
        return await this.joiValidator.validateAsync<SigninUserDto>(new SigninUserDto(iDto));
    }
    public async getLogoutUserDto(iDto: {
        refreshToken: string | string[] | ParsedQs | ParsedQs[] | undefined;
    }): Promise<LogoutUserDto> {
        return await this.joiValidator.validateAsync<LogoutUserDto>(new LogoutUserDto(iDto));
    }
    public async getPublishTokenDto(iDto: {
        refreshToken: string | string[] | ParsedQs | ParsedQs[] | undefined;
    }): Promise<PublishTokenDto> {
        return await this.joiValidator.validateAsync<PublishTokenDto>(new PublishTokenDto(iDto));
    }
    public async getConfirmEmailDto(iDto: {
        email: string | string[] | ParsedQs | ParsedQs[] | undefined;
        emailVerifyCode: string | string[] | ParsedQs | ParsedQs[] | undefined;
    }): Promise<ConfirmEmailDto> {
        return await this.joiValidator.validateAsync<ConfirmEmailDto>(new ConfirmEmailDto(iDto));
    }
    public async getConfirmNicknameDto(iDto: {
        emailVerifyToken: string | string[] | ParsedQs | ParsedQs[] | undefined;
        nickname: string | string[] | ParsedQs | ParsedQs[] | undefined;
    }): Promise<ConfirmNicknameDto> {
        return await this.joiValidator.validateAsync<ConfirmNicknameDto>(new ConfirmNicknameDto(iDto));
    }
    public async getSendPasswordDto(iDto: {
        email: string | string[] | ParsedQs | ParsedQs[] | undefined;
    }): Promise<SendPasswordDto> {
        return await this.joiValidator.validateAsync<SendPasswordDto>(new SendPasswordDto(iDto));
    }
    public async getResetPasswordDto(iDto: {
        resetPasswordToken: string | string[] | ParsedQs | ParsedQs[] | undefined;
    }): Promise<ResetPasswordDto> {
        return await this.joiValidator.validateAsync<ResetPasswordDto>(new ResetPasswordDto(iDto));
    }
    public async getSendEmailDto(iDto: {
        email: string | string[] | ParsedQs | ParsedQs[] | undefined;
    }): Promise<SendEmailDto> {
        return await this.joiValidator.validateAsync<SendEmailDto>(new SendEmailDto(iDto));
    }

    // PROFILE

    public async getEditProfileDto(iDto: {
        userId: number;
        nickname: string | string[] | ParsedQs | ParsedQs[] | undefined;
        password: string | string[] | ParsedQs | ParsedQs[] | undefined;
        imageUrl: string | undefined;
        resizedUrl: string | undefined;
    }): Promise<EditProfileDto> {
        return await this.joiValidator.validateAsync<EditProfileDto>(new EditProfileDto(iDto));
    }

    public async getGetMyRecipeDto(iDto: {
        userId: number;
        page: string | string[] | ParsedQs | ParsedQs[] | undefined;
        count: string | string[] | ParsedQs | ParsedQs[] | undefined;
    }): Promise<GetMyRecipeDto> {
        return await this.joiValidator.validateAsync<GetMyRecipeDto>(new GetMyRecipeDto(iDto));
    }
    public async getGetLikeRecipeDto(iDto: {
        userId: number;
        page: string | string[] | ParsedQs | ParsedQs[] | undefined;
        count: string | string[] | ParsedQs | ParsedQs[] | undefined;
    }): Promise<GetLikeRecipeDto> {
        return await this.joiValidator.validateAsync<GetMyRecipeDto>(new GetLikeRecipeDto(iDto));
    }

    // RECIPE
    public async getCreateRecipeDto() {
        //
    }
    public async getUpdateRecipeDto() {
        //
    }
    public async getIngredientDto() {
        //
    }
    public async getCommonRecipeDto() {
        //
    }
    public async getDeleteRecipeDto() {
        //
    }
    public async getGetRecipeDto() {
        //
    }
    public async getRecipeDto() {
        //
    }
    public async getIRecipeDto() {
        //
    }
    // COMMENT
    public async getCreateCommentDto() {
        //
    }
    public async getDeleteCommentDto() {
        //
    }
    public async getUpdateCommentDto() {
        //
    }
    public async getGetCommentDto() {
        //
    }
}

import {
    UserDto,
    SignupUserDto,
    SigninUserDto,
    ISigninUserDto,
    LogoutUserDto,
    PublishTokenDto,
    ConfirmEmailDto,
    ConfirmNicknameDto,
    SendPasswordDto,
    ResetPasswordDto,
    SendEmailDto,
    EditProfileDto,
    // RECIPE
    CreateRecipeDto,
    UpdateRecipeDto,
    IngredientDto,
    CommonRecipeDto,
    DeleteRecipeDto,
    GetMyRecipeDto,
    GetRecipeDto,
    RecipeDto,
    IRecipeDto,
    // COMMENT
    CreateCommentDto,
    DeleteCommentDto,
    UpdateCommentDto,
    GetCommentDto,
    IBaseDto,
    ILogoutUserDto,
    IPublishTokenDto,
    IConfirmEmailDto,
    ISendEmailDto,
    ISendPasswordDto,
    IResetPasswordDto,
    IEditProfileDto,
    IGetMyRecipeDto,
    GetLikeRecipeDto,
} from "../../models/_.loader";
