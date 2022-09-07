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
import { UserDto, IUserDto } from "./dtos/user/user.dto";
import { SignupUserDto, ISignupUserDto } from "./dtos/user/signup.user.dto";
import { SigninUserDto, ISigninUserDto } from "./dtos/user/singin.user.dto";
import { PublishTokenDto, IPublishTokenDto } from "./dtos/user/publish.token.dto";

import { ConfirmEmailDto, IConfirmEmailDto } from "./dtos/user/confirm.email.dto";
import { ConfirmNicknameDto, IConfirmNicknameDto } from "./dtos/user/confirm.nickname.dto";
import { ConfirmPasswordDto, IConfirmPasswordDto } from "./dtos/user/confirm.password.dto";

import { SendEmailDto, ISendEmailDto } from "./dtos/user/send.email.dto";

import { EditProfileDto, IEditProfileDto } from "./dtos/user/edit.profile.dto";

import { IngredientDto, IIngredientDto } from "./dtos/recipe/ingredient.dto";
import { CreateRecipeDto, ICreateRecipeDto } from "./dtos/recipe/create.recipe.dto";
import { UpdateRecipeDto } from "./dtos/recipe/update.recipe.dto";
import { CreateCommentDto } from "./dtos/comment/comment.dto";

import { IUserPacket, IUserRefresthTokenPacket } from "./packets/i.user.packet";
import { IUserVerifyListPacket } from "./packets/i.email.verify.packet";

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
    // Dtos
    IBaseDto,
    UserDto,
    IUserDto,
    SignupUserDto,
    ISignupUserDto,
    SigninUserDto,
    ISigninUserDto,
    PublishTokenDto,
    IPublishTokenDto,
    ConfirmEmailDto,
    IConfirmEmailDto,
    ConfirmNicknameDto,
    IConfirmNicknameDto,
    ConfirmPasswordDto,
    IConfirmPasswordDto,
    SendEmailDto,
    ISendEmailDto,
    EditProfileDto,
    IEditProfileDto,
    CreateRecipeDto,
    ICreateRecipeDto,
    UpdateRecipeDto,
    IngredientDto,
    IIngredientDto,
    CreateCommentDto,
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
