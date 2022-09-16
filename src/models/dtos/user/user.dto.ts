export interface IUserDto {
    userId: number;
    email: string;
    nickname: string;
    imageUrl: string | null;
    resizedUrl: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}

export class UserDto implements IUserDto {
    userId: number;
    email: string;
    nickname: string;
    imageUrl: string | null;
    resizedUrl: string | null;
    createdAt: string | null;
    updatedAt: string | null;

    constructor(userDto: {
        userId: number;
        email: string;
        nickname: string;
        imageUrl: string | undefined;
        resizedUrl: string | undefined;
        createdAt: string | undefined;
        updatedAt: string | undefined;
    }) {
        this.userId = userDto.userId;
        this.email = userDto.email;
        this.nickname = userDto.nickname;

        this.imageUrl = userDto.imageUrl ? userDto.imageUrl : null;
        this.resizedUrl = userDto.resizedUrl ? userDto.resizedUrl : null;

        this.createdAt = userDto.createdAt ? userDto.createdAt : null;
        this.updatedAt = userDto.updatedAt ? userDto.updatedAt : null;
    }
}
