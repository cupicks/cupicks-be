import * as joi from "joi";
import { ObjectSchema } from "joi";

import { IBaseDto } from "../i.base.dto";
import { RequestQueryExtractor } from "../request.query.extractor";

import { ERecipeSize, ERecipeTemperature, ERecipeCategory } from "../../enums/_.exporter";

export interface IEditProfileDto {
    userId: number;
    nickname: string | undefined;
    password: string | undefined;

    imageUrl: string | undefined;
    resizedUrl: string | undefined;

    favorCupSizeList: ERecipeSize[];
    favorTemperatureList: ERecipeTemperature[];
    favorCategoryList: ERecipeCategory[];

    disfavorCupSizeList: ERecipeSize[];
    disfavorTemperatureList: ERecipeTemperature[];
    disfavorCategoryList: ERecipeCategory[];
}

export class EditProfileDto
    extends RequestQueryExtractor<"nickname" | "password" | "favorCategory" | "disfavorCategory">
    implements IBaseDto, IEditProfileDto
{
    userId: number;
    nickname: string | undefined;
    password: string | undefined;
    imageUrl: string | undefined;
    resizedUrl: string | undefined;

    favorCupSizeList: ERecipeSize[];
    favorTemperatureList: ERecipeTemperature[];
    favorCategoryList: ERecipeCategory[];

    disfavorCupSizeList: ERecipeSize[];
    disfavorTemperatureList: ERecipeTemperature[];
    disfavorCategoryList: ERecipeCategory[];

    constructor({
        userId,
        nickname,
        password,
        imageUrl,
        resizedUrl,
        favorCupSizeList,
        favorTemperatureList,
        favorCategoryList,
        disfavorCupSizeList,
        disfavorTemperatureList,
        disfavorCategoryList,
    }: {
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
    }) {
        super();
        this.userId = userId;
        this.nickname = nickname;
        this.password = password;

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

    getJoiInstance(): ObjectSchema<EditProfileDto> {
        return joi.object<EditProfileDto>({
            userId: joi.number().required().min(1).message("userId ??? 1 ????????? ?????? ?????? ?????????."),
            nickname: joi
                .string()
                .trim()
                .regex(/[???-???\w\d]/)
                .min(2)
                .max(10)
                .message(
                    "nickname ??? 2??? ?????? 10??? ????????? ??????, ??????, ?????? ???????????????. (?????????, ?????????, ???????????? ??????)",
                ),
            password: joi
                .string()
                .trim()
                .regex(/[!@#]{1,}/)
                .regex(/[^[!@#]|[^\w\d]]|[???-??????-??????-???]/)
                .min(8)
                .max(15)
                .message(
                    "password ??? 8??? ?????? 15??? ????????? ??????, ?????? ???????????????. (???????????? !@# ??? 1??? ??? ????????? ??????????????? ?????????.)",
                ),
            imageUrl: joi.string().max(255).message("imageUrl ??? 255 ??? ???????????? ?????????."),
            resizedUrl: joi.string().max(255).message("resizedUrl ??? 255 ??? ???????????? ?????????."),
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
