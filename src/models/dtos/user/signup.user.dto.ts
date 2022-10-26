import * as joi from "joi";
import { ObjectSchema } from "joi";

import { IBaseDto } from "../i.base.dto";
import { RequestQueryExtractor } from "../request.query.extractor";

import { ERecipeSize, ERecipeTemperature, ERecipeCategory } from "../../enums/_.exporter";

export interface ISignupUserDto {
    password: string;
    imageUrl: string | undefined;
    resizedUrl: string | undefined;
    nicknameVerifyToken: string;
    emailVerifyToken: string;

    favorCupSizeList: ERecipeSize[];
    favorTemperatureList: ERecipeTemperature[];
    favorCategoryList: ERecipeCategory[];

    disfavorCupSizeList: ERecipeSize[];
    disfavorTemperatureList: ERecipeTemperature[];
    disfavorCategoryList: ERecipeCategory[];
}

export class SignupUserDto extends RequestQueryExtractor<string> implements IBaseDto, ISignupUserDto {
    password: string;
    imageUrl: string | undefined;
    resizedUrl: string | undefined;
    nicknameVerifyToken: string;
    emailVerifyToken: string;

    favorCupSizeList: ERecipeSize[];
    favorTemperatureList: ERecipeTemperature[];
    favorCategoryList: ERecipeCategory[];

    disfavorCupSizeList: ERecipeSize[];
    disfavorTemperatureList: ERecipeTemperature[];
    disfavorCategoryList: ERecipeCategory[];

    constructor({
        password,
        imageUrl,
        resizedUrl,
        emailVerifyToken,
        nicknameVerifyToken,
        favorCupSizeList,
        favorTemperatureList,
        favorCategoryList,
        disfavorCupSizeList,
        disfavorTemperatureList,
        disfavorCategoryList,
    }: {
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
    }) {
        super();

        this.password = password;
        this.emailVerifyToken = emailVerifyToken;
        this.nicknameVerifyToken = nicknameVerifyToken;

        this.imageUrl = imageUrl;
        this.resizedUrl = resizedUrl ? resizedUrl.replace(/\/profile\//, `/profile-resized/`) : undefined;

        // Favor

        const tempfavorCupSizeList =
            favorCupSizeList
                ?.split(",")
                ?.map((str) => ERecipeSize[str])
                ?.filter((v) => v) ?? [];
        const favorCupSizeSet = new Set(tempfavorCupSizeList);
        this.favorCupSizeList = [...favorCupSizeSet];

        const tempFavorTemperatureList =
            favorTemperatureList
                ?.split(",")
                ?.map((str) => ERecipeTemperature[str])
                ?.filter((v) => v) ?? [];
        const favorTemperatureSet = new Set(tempFavorTemperatureList);
        this.favorTemperatureList = [...favorTemperatureSet];

        const tempFavorCategoryList =
            favorCategoryList
                ?.split(",")
                ?.map((str) => ERecipeCategory[str])
                ?.filter((v) => v) ?? [];
        const favorCategorySet = new Set(tempFavorCategoryList);
        this.favorCategoryList = [...favorCategorySet];

        // Disfavor

        const tempDisfavorCupSizeList =
            disfavorCupSizeList
                ?.split(",")
                ?.map((str) => ERecipeSize[str])
                ?.map((enumStr) => (favorCupSizeSet.has(enumStr) ? undefined : enumStr))
                ?.filter((v) => v) ?? [];
        const disfavorCupSizeSet = new Set(tempDisfavorCupSizeList);
        this.disfavorCupSizeList = [...disfavorCupSizeSet];

        const tempDisfavorTemperatureList =
            disfavorTemperatureList
                ?.split(",")
                ?.map((str) => ERecipeTemperature[str])
                ?.map((enumStr) => (favorTemperatureSet.has(enumStr) ? undefined : enumStr))
                ?.filter((v) => v) ?? [];
        const disfavorTemperatureSet = new Set(tempDisfavorTemperatureList);
        this.disfavorTemperatureList = [...disfavorTemperatureSet];

        const tempDisfavorCategoryList =
            disfavorCategoryList
                ?.split(",")
                ?.map((str) => ERecipeCategory[str])
                ?.map((enumStr) => (favorCategorySet.has(enumStr) ? undefined : enumStr))
                ?.filter((v) => v) ?? [];
        const disfavorCategorySet = new Set(tempDisfavorCategoryList);
        this.disfavorCategoryList = [...disfavorCategorySet];
    }

    getJoiInstance(): ObjectSchema<SignupUserDto> {
        return joi.object<SignupUserDto>({
            password: joi
                .string()
                .required()
                .trim()
                .regex(/[!@#]{1,}/)
                .regex(/[^[!@#]|[^\w\d]]|[ㄱ-ㅎㅏ-ㅣ가-힣]/)
                .min(8)
                .max(15)
                .message(
                    "password 는 8자 이상 15자 이하의 영문, 숫자 조합입니다. (특수문자 !@# 는 1개 가 반드시 포함되어야 합니다.)",
                ),
            imageUrl: joi.string().max(255).message("imageUrl 은 255 자 이하여야 합니다."),
            resizedUrl: joi.string().max(255).message("resizedUrl 은 255 자 이하여야 합니다."),
            nicknameVerifyToken: joi
                .string()
                .required()
                .max(1000)
                .message("NicknameVerifyToken 은 반드시 포함하여야 합니다."),
            emailVerifyToken: joi
                .string()
                .required()
                .max(1000)
                .message("NicknameVerifyToken 은 반드시 포함하여야 합니다."),
            // CupSize
            favorCupSizeList: joi
                .array()
                .items(joi.string().equal(ERecipeSize.small, ERecipeSize.medium, ERecipeSize.large)),
            disfavorCupSizeList: joi
                .array()
                .items(joi.string().equal(ERecipeSize.small, ERecipeSize.medium, ERecipeSize.large)),
            // CupTemplature
            favorTemperatureList: joi.array().items(joi.string().equal(ERecipeTemperature.ice, ERecipeTemperature.hot)),
            disfavorTemperatureList: joi
                .array()
                .items(joi.string().equal(ERecipeTemperature.ice, ERecipeTemperature.hot)),
            // CupIngredient
            favorCategoryList: joi
                .array()
                .items(
                    joi
                        .string()
                        .equal(
                            ERecipeCategory.coffee_mlik,
                            ERecipeCategory.whipping_cream,
                            ERecipeCategory.vanilla_syrup,
                            ERecipeCategory.hazelnut_syrup,
                            ERecipeCategory.cramel_syrup,
                            ERecipeCategory.choco_green_tea,
                            ERecipeCategory.tea,
                            ERecipeCategory.strawberry,
                            ERecipeCategory.green_grape,
                            ERecipeCategory.orange,
                            ERecipeCategory.grapefruit,
                            ERecipeCategory.lemon,
                            ERecipeCategory.blue_berry,
                            ERecipeCategory.tapioca_pearl,
                            ERecipeCategory.sparkling_water,
                            ERecipeCategory.mint,
                            ERecipeCategory.cinnamon,
                        ),
                ),
            disfavorCategoryList: joi
                .array()
                .items(
                    joi
                        .string()
                        .equal(
                            ERecipeCategory.coffee_mlik,
                            ERecipeCategory.whipping_cream,
                            ERecipeCategory.vanilla_syrup,
                            ERecipeCategory.hazelnut_syrup,
                            ERecipeCategory.cramel_syrup,
                            ERecipeCategory.choco_green_tea,
                            ERecipeCategory.tea,
                            ERecipeCategory.strawberry,
                            ERecipeCategory.green_grape,
                            ERecipeCategory.orange,
                            ERecipeCategory.grapefruit,
                            ERecipeCategory.lemon,
                            ERecipeCategory.blue_berry,
                            ERecipeCategory.tapioca_pearl,
                            ERecipeCategory.sparkling_water,
                            ERecipeCategory.mint,
                            ERecipeCategory.cinnamon,
                        ),
                ),
        });
    }
}
