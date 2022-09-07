export interface IResponse {
    userId: number;
    nickname: string;
    recipeId?: number;
    commentId: number;
    comment: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}

export interface IResponseCustom extends Array<IResponse> {}
