import { ParsedQs } from "qs";
import { JoiValidator } from "../../modules/_.loader";

export class DtoFactory {
    private joiValidator: JoiValidator;
    constructor() {
        this.joiValidator = new JoiValidator();
    }

    // USER
    public async getSignupUserDto(iDto: {
        password: string;
        imageUrl: string | undefined;
        resizedUrl: string | undefined;
        nicknameVerifyToken: string;
        emailVerifyToken: string;

        favorCupSizeList: string | undefined;
        favorTemperatureList: string | undefined;
        favorCategoryList: string | undefined;

        disfavorCupSizeList: string | undefined;
        disfavorTemperatureList: string | undefined;
        disfavorCategoryList: string | undefined;
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
    public async getConfirmEmailDto(iDto: IConfirmEmailDto): Promise<ConfirmEmailDto> {
        return await this.joiValidator.validateAsync<ConfirmEmailDto>(new ConfirmEmailDto(iDto));
    }
    public async getConfirmNicknameDto(iDto: IConfirmNicknameDto): Promise<ConfirmNicknameDto> {
        return await this.joiValidator.validateAsync<ConfirmNicknameDto>(new ConfirmNicknameDto(iDto));
    }
    public async getSendPasswordDto(iDto: ISendPasswordDto): Promise<SendPasswordDto> {
        return await this.joiValidator.validateAsync<SendPasswordDto>(new SendPasswordDto(iDto));
    }
    public async getResetPasswordDto(iDto: IResetPasswordDto): Promise<ResetPasswordDto> {
        return await this.joiValidator.validateAsync<ResetPasswordDto>(new ResetPasswordDto(iDto));
    }
    public async getSendEmailDto(iDto: ISendEmailDto): Promise<SendEmailDto> {
        return await this.joiValidator.validateAsync<SendEmailDto>(new SendEmailDto(iDto));
    }

    // PROFILE

    public async getEditProfileDto(iDto: {
        userId: number;
        nickname: string | undefined;
        password: string | undefined;

        imageUrl: string | undefined;
        resizedUrl: string | undefined;

        favorCupSizeList: string | undefined;
        favorTemperatureList: string | undefined;
        favorCategoryList: string | undefined;

        disfavorCupSizeList: string | undefined;
        disfavorTemperatureList: string | undefined;
        disfavorCategoryList: string | undefined;
    }): Promise<EditProfileDto> {
        return await this.joiValidator.validateAsync<EditProfileDto>(new EditProfileDto(iDto));
    }
    public async getMyProfileDto(iDto: { userId: number }): Promise<GetMyProfileDto> {
        return await this.joiValidator.validateAsync<GetMyProfileDto>(new GetMyProfileDto(iDto));
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
    public async getCreateRecipeDto(iDto: ICreateRecipeDto): Promise<CreateRecipeDto> {
        return await this.joiValidator.validateAsync<CreateRecipeDto>(new CreateRecipeDto(iDto));
    }
    public async getUpdateRecipeDto(iDto: IUpdateRecipeDto): Promise<UpdateRecipeDto> {
        return await this.joiValidator.validateAsync<UpdateRecipeDto>(new UpdateRecipeDto(iDto));
    }
    public async getIngredientDto(iDto: {
        ingredientName: string;
        ingredientColor: string;
        ingredientAmount: string;
    }): Promise<IngredientDto> {
        return await new IngredientDto(iDto);
    }
    public async getCommonRecipeDto(iDto: { recipeId: number; userId: number | null }): Promise<CommonRecipeDto> {
        return await this.joiValidator.validateAsync<CommonRecipeDto>(new CommonRecipeDto(iDto));
    }
    public async getDeleteRecipeDto(iDto: { userId: number; recipeId: number }): Promise<DeleteRecipeDto> {
        return await this.joiValidator.validateAsync<DeleteRecipeDto>(new DeleteRecipeDto(iDto));
    }
    public async getGetRecipeDto(iDto: { page: number; count: number; userId: number | null }): Promise<GetRecipeDto> {
        return await this.joiValidator.validateAsync<GetRecipeDto>(new GetRecipeDto(iDto));
    }
    public async getRecipeDto(iDto: { page: number; count: number; userId: number | null }): Promise<GetRecipeDto> {
        return await this.joiValidator.validateAsync<GetRecipeDto>(new GetRecipeDto(iDto));
    }
    public async getIRecipeDto(iDto: {
        recipeId: number;
        nickname: string;
        imageUrl: string | undefined;
        resizedUrl: string | undefined;
        title: string;
        content: string;
        isIced: 0 | 1;
        cupSize: string;
        createdAt: string;
        updatedAt: string;
        ingredientList: IIngredientDto[];
        isLiked: boolean;
    }): Promise<RecipeDto> {
        return new RecipeDto(iDto);
    }
    // COMMENT
    public async getCreateCommentDto(iDto: {
        userId: number;
        nickname: string;
        recipeId: string | string[] | ParsedQs | ParsedQs[] | undefined;
        comment: string;
        imageUrl: string | undefined;
        resizedUrl: string | undefined;
    }): Promise<CreateCommentDto> {
        return await this.joiValidator.validateAsync<CreateCommentDto>(new CreateCommentDto(iDto));
    }
    public async getDeleteCommentDto(iDto: { userId: number; commentId: number }): Promise<DeleteCommentDto> {
        return await this.joiValidator.validateAsync<DeleteCommentDto>(new DeleteCommentDto(iDto));
    }
    public async getUpdateCommentDto(iDto: {
        userId: number;
        nickname: string;
        commentId: number;
        comment: string;
        imageUrl: string | undefined;
        resizedUrl: string | undefined;
    }): Promise<UpdateCommentDto> {
        return await this.joiValidator.validateAsync<UpdateCommentDto>(new UpdateCommentDto(iDto));
    }
    public async getGetCommentDto(iDto: { recipeId: number; page: number; count: number }): Promise<GetCommentDto> {
        return await this.joiValidator.validateAsync<GetCommentDto>(new GetCommentDto(iDto));
    }

    // RANKING
    public async getBestRecipeDto(iDto: { userId: number | null }): Promise<BestRecipeDto> {
        return await this.joiValidator.validateAsync<BestRecipeDto>(new BestRecipeDto(iDto));
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
    IIngredientDto,
    // RANKING
    BestRecipeDto,
    IUpdateRecipeDto,
    ICreateRecipeDto,
    GetMyProfileDto,
    ISignupUserDto,
    IConfirmNicknameDto,
} from "../../models/_.loader";
