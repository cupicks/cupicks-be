import { ERecipeCategory, ERecipeSize, ERecipeTemperature } from "../../enums/_.exporter";

export interface IUserDto {
    userId: number;
    email: string;
    nickname: string;
    imageUrl: string | null;
    resizedUrl: string | null;
    createdAt: string | null;
    updatedAt: string | null;

    favorCupSizeList: ERecipeSize[] | null;
    favorTemperatureList: ERecipeTemperature[] | null;
    favorCategoryList: ERecipeCategory[] | null;

    disfavorCupSizeList: ERecipeSize[] | null;
    disfavorTemperatureList: ERecipeTemperature[] | null;
    disfavorCategoryList: ERecipeCategory[] | null;
}

export class UserDto implements IUserDto {
    userId: number;
    email: string;
    nickname: string;
    imageUrl: string | null;
    resizedUrl: string | null;
    createdAt: string | null;
    updatedAt: string | null;

    favorCupSizeList: ERecipeSize[] | null;
    favorTemperatureList: ERecipeTemperature[] | null;
    favorCategoryList: ERecipeCategory[] | null;

    disfavorCupSizeList: ERecipeSize[] | null;
    disfavorTemperatureList: ERecipeTemperature[] | null;
    disfavorCategoryList: ERecipeCategory[] | null;

    constructor(userDto: {
        userId: number;
        email: string;
        nickname: string;
        imageUrl: string | undefined;
        resizedUrl: string | undefined;
        createdAt: string | undefined;
        updatedAt: string | undefined;

        favorCupSizeList: ERecipeSize[] | undefined;
        favorTemperatureList: ERecipeTemperature[] | undefined;
        favorCategoryList: ERecipeCategory[] | undefined;

        disfavorCupSizeList: ERecipeSize[] | undefined;
        disfavorTemperatureList: ERecipeTemperature[] | undefined;
        disfavorCategoryList: ERecipeCategory[] | undefined;
    }) {
        this.userId = userDto.userId;
        this.email = userDto.email;
        this.nickname = userDto.nickname;

        this.imageUrl = userDto.imageUrl ? userDto.imageUrl : null;
        this.resizedUrl = userDto.resizedUrl ? userDto.resizedUrl : null;

        this.createdAt = userDto.createdAt ? userDto.createdAt : null;
        this.updatedAt = userDto.updatedAt ? userDto.updatedAt : null;

        this.favorCupSizeList = userDto.favorCupSizeList ? userDto.favorCupSizeList : null;
        this.favorTemperatureList = userDto.favorTemperatureList ? userDto.favorTemperatureList : null;
        this.favorCategoryList = userDto.favorCategoryList ? userDto.favorCategoryList : null;

        this.disfavorCupSizeList = userDto.disfavorCupSizeList ? userDto.disfavorCupSizeList : null;
        this.disfavorTemperatureList = userDto.disfavorTemperatureList ? userDto.disfavorTemperatureList : null;
        this.disfavorCategoryList = userDto.disfavorCategoryList ? userDto.disfavorCategoryList : null;
    }
}
