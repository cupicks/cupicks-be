import { Env, IJwtEnv, IMysqlEnv } from "./env/env";
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
} from "./exceptions/custom.exception";

import { IBaseDto } from "./dtos/i.base.dto";
import { SignupUserDto } from "./dtos/signup.user.dto";
import { IngredientDto, IIngredientDto } from "./dtos/recipe/ingredient.dto";
import { CreateRecipeDto, ICreateRecipeDto } from "./dtos/recipe/create.recipe.dto";

export {
    Env,
    IJwtEnv,
    IMysqlEnv,
    IBaseDto,
    SignupUserDto,
    CreateRecipeDto,
    ICreateRecipeDto,
    IngredientDto,
    IIngredientDto,
    CustomException, // 500
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
