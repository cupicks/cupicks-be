import { ERecipeCategory } from "models/enums/e.recipe.category";

export interface IUserDto {
    userId: number;
    email: string;
    nickname: string;
    imageUrl: string | null;
    resizedUrl: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    favorCategory: ERecipeCategory[] | null;
    disfavorCategory: ERecipeCategory[] | null;
}

export class UserDto implements IUserDto {
    userId: number;
    email: string;
    nickname: string;
    imageUrl: string | null;
    resizedUrl: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    favorCategory: ERecipeCategory[] | null;
    disfavorCategory: ERecipeCategory[] | null;

    constructor(userDto: {
        userId: number;
        email: string;
        nickname: string;
        imageUrl: string | undefined;
        resizedUrl: string | undefined;
        createdAt: string | undefined;
        updatedAt: string | undefined;
        favorCategory: ERecipeCategory[] | undefined;
        disfavorCategory: ERecipeCategory[] | undefined;
    }) {
        this.userId = userDto.userId;
        this.email = userDto.email;
        this.nickname = userDto.nickname;

        this.imageUrl = userDto.imageUrl ? userDto.imageUrl : null;
        this.resizedUrl = userDto.resizedUrl ? userDto.resizedUrl : null;

        this.createdAt = userDto.createdAt ? userDto.createdAt : null;
        this.updatedAt = userDto.updatedAt ? userDto.updatedAt : null;
        this.favorCategory = userDto.favorCategory ? userDto.favorCategory : null;
        this.disfavorCategory = userDto.disfavorCategory ? userDto.disfavorCategory : null;
    }
}
