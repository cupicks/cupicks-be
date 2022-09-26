import { Env, IJwtEnv, IMysqlEnv, IS3ConfigEnv, ISesConfigEnv } from "./env/env";
import {
    CustomException,
    ValidationException,
    ConflictException,
    JwtAuthorizationException,
    ForBiddenException,
    NotFoundException,
    UnkownTypeError,
    UnkownError,
    UnOverrideDtoError,
    DatabaseConnectionError,
    BadRequestException,
} from "./exceptions/custom.exception";

import { IBaseDto } from "./dtos/i.base.dto";

// USER

import { UserDto, IUserDto } from "./dtos/user/user.dto";
import { SignupUserDto, ISignupUserDto } from "./dtos/user/signup.user.dto";
import { SigninUserDto, ISigninUserDto } from "./dtos/user/singin.user.dto";
import { LogoutUserDto, ILogoutUserDto } from "./dtos/user/logout.user.dto";
import { PublishTokenDto, IPublishTokenDto } from "./dtos/user/publish.token.dto";

import { ConfirmEmailDto, IConfirmEmailDto } from "./dtos/user/confirm.email.dto";
import { ConfirmNicknameDto, IConfirmNicknameDto } from "./dtos/user/confirm.nickname.dto";
import { SendPasswordDto, ISendPasswordDto } from "./dtos/user/send.password.dto";
import { ResetPasswordDto, IResetPasswordDto } from "./dtos/user/reset.password.dto";

import { SendEmailDto, ISendEmailDto } from "./dtos/user/send.email.dto";

// PROFILE

import { EditProfileDto, IEditProfileDto } from "./dtos/profile/edit.profile.dto";
import { GetMyRecipeDto, IGetMyRecipeDto } from "./dtos/profile/get.my.recipe.dto";
import { GetLikeRecipeDto, IGetLikeRecipeDto } from "./dtos/profile/get.like.recipe.dto";

import { GetMyProfileDto, IGetMyProfileDto } from "./dtos/profile/get.my.profile.dto";

// RECIPE

import { IngredientDto, IIngredientDto } from "./dtos/recipe/ingredient.dto";
import { CreateRecipeDto, ICreateRecipeDto } from "./dtos/recipe/create.recipe.dto";
import { UpdateRecipeDto, IUpdateRecipeDto } from "./dtos/recipe/update.recipe.dto";
import { CommonRecipeDto } from "./dtos/recipe/common.recipe.dts";
import { DeleteRecipeDto } from "./dtos/recipe/delete.recipe.dto";
import { GetRecipeDto } from "./dtos/recipe/get.recipe.dto";

import { RecipeDto, IRecipeDto } from "./dtos/recipe/recipe.dto";

// COMMENT
import { CreateCommentDto } from "./dtos/comment/create.comment.dto";
import { DeleteCommentDto } from "./dtos/comment/delete.comment.dto";
import { UpdateCommentDto } from "./dtos/comment/update.comment.dto";
import { GetCommentDto } from "./dtos/comment/get.comment.dto";

// RANKING
import { BestRecipeDto } from "./dtos/ranking/best.recipe.dto";

// PACKET - USER
import { IUserPacket, IUserRefresthTokenPacket } from "./packets/i.user.packet";
import { IUserVerifyListPacket } from "./packets/i.email.verify.packet";

// PACKET - RECIPE
import { IRecipePacket } from "./packets/i.recipe.packet";
import { IRecipeOwnerPacket } from "./packets/i.recipe.owner.packet";
import { IRecipeCombinedPacket } from "./packets/i.recipe.combined.packet";
import { IRecipeIngredientPacket } from "./packets/i.recipe.ingredient.packet";
import { IRecipeIngredientListPacket } from "./packets/i.recipe.ingredient.list.packet";
import { IRecipeLikePacket } from "./packets/i.recipe.like.packet";

// PACKET - COMMENT
import { ICommentPacket } from "./packets/i.comment.packet";

// PACKET - RANKING
import { IWeeklyBestPacket } from "./packets/i.weekly.packet";
import { IBestRecipePacket, IBestRecipeCategoryPacket } from "./packets/i.best.recipe.packet";

export {
    Env,
    IJwtEnv,
    IMysqlEnv,
    IS3ConfigEnv,
    ISesConfigEnv,
    // Packets
    IUserPacket,
    IUserRefresthTokenPacket,
    IUserVerifyListPacket,
    IRecipePacket,
    IRecipeLikePacket,
    IRecipeCombinedPacket,
    IRecipeIngredientPacket,
    IRecipeIngredientListPacket,
    ICommentPacket,
    IWeeklyBestPacket,
    IBestRecipePacket,
    IBestRecipeCategoryPacket,
    IRecipeOwnerPacket,

    // BaseDtos
    IBaseDto,
    // USER
    UserDto,
    IUserDto,
    SignupUserDto,
    ISignupUserDto,
    SigninUserDto,
    ISigninUserDto,
    LogoutUserDto,
    ILogoutUserDto,
    PublishTokenDto,
    IPublishTokenDto,
    ConfirmEmailDto,
    IConfirmEmailDto,
    ConfirmNicknameDto,
    IConfirmNicknameDto,
    SendPasswordDto,
    ISendPasswordDto,
    ResetPasswordDto,
    IResetPasswordDto,
    SendEmailDto,
    ISendEmailDto,
    EditProfileDto,
    IEditProfileDto,
    GetMyProfileDto,
    IGetMyProfileDto,
    // RECIPE
    CreateRecipeDto,
    ICreateRecipeDto,
    UpdateRecipeDto,
    IUpdateRecipeDto,
    IngredientDto,
    IIngredientDto,
    CommonRecipeDto,
    DeleteRecipeDto,
    GetMyRecipeDto,
    IGetMyRecipeDto,
    GetLikeRecipeDto,
    IGetLikeRecipeDto,
    GetRecipeDto,
    RecipeDto,
    IRecipeDto,
    // COMMENT
    CreateCommentDto,
    DeleteCommentDto,
    UpdateCommentDto,
    GetCommentDto,

    // RANKING
    BestRecipeDto,
    // CustomExceptions
    CustomException, // 500
    BadRequestException, // 400
    ValidationException, // 400
    JwtAuthorizationException, // 401
    ForBiddenException, // 403
    NotFoundException, // 404
    ConflictException, // 409
    UnkownTypeError, // 500
    UnkownError, // 500
    UnOverrideDtoError, // 500
    DatabaseConnectionError, //500
};
