export interface IUserDto {
    userId: number;
    email: string;
    nickname: string;
    imageUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

export class UserDto implements IUserDto {
    userId: number;
    email: string;
    nickname: string;
    imageUrl?: string;
    createdAt?: string;
    updatedAt?: string;

    constructor({ userId, email, nickname, imageUrl, createdAt, updatedAt }: IUserDto) {
        this.userId = userId;
        this.email = email;
        this.nickname = nickname;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
