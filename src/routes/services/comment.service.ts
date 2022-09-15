import { CreateCommentDto, NotFoundException } from "../../models/_.loader";
import { CommentRepository, RecipeRepository, AuthRepository } from "../repositories/_.exporter";
import { MysqlProvider } from "../../modules/_.loader";
import { MulterProvider } from "../../modules/_.loader";
import { ICommentPacket } from "../../models/_.loader";
import { ICommentResponse } from "../../constants/_.loader";

export class CommentService {
    private commentRepository: CommentRepository;
    private mysqlProvider: MysqlProvider;
    private recipeRepository: RecipeRepository;
    private authRepository: AuthRepository;

    constructor() {
        this.commentRepository = new CommentRepository();
        this.mysqlProvider = new MysqlProvider();
        this.recipeRepository = new RecipeRepository();
        this.authRepository = new AuthRepository();
    }

    public createComment = async (
        commentDto: CreateCommentDto,
        userId: number,
        recipeId: number,
        imageLocation: string | null,
    ): Promise<ICommentResponse> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            const date = new Date().toISOString().slice(0, 19).replace("T", " ");

            await conn.beginTransaction();

            const isExists = await this.authRepository.isExistsById(conn, userId);
            if (isExists === false) throw new NotFoundException(`이미 탈퇴한 사용자의 토큰입니다.`);

            const createComment = await this.commentRepository.createComment(conn, commentDto, imageLocation);
            const commentId = createComment;

            const createRecipeComment = await this.commentRepository.createRecipeComment(
                conn,
                userId,
                recipeId,
                commentId,
            );

            await conn.commit();

            return {
                commentId,
                createdAt: date,
                updatedAt: date,
            };
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            await conn.release();
        }
    };

    public deleteComment = async (userId: number, commentId: number): Promise<void> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const isExists = await this.authRepository.isExistsById(conn, userId);
            if (isExists === false) throw new NotFoundException(`이미 탈퇴한 사용자의 토큰입니다.`);

            const isAuthenticated = await this.commentRepository.isAuthenticated(conn, userId, commentId);
            if (!isAuthenticated) throw new Error("내가 작성한 코멘트가 아닙니다.");

            const findCommentById = await this.commentRepository.findCommentByCommentId(conn, commentId);
            const findCommentResult = findCommentById[0].image_url;

            const imageValue = findCommentResult !== null ? findCommentResult?.split("/")[4] : null;

            if (imageValue !== null && imageValue !== "undefined" && typeof imageValue === "string") {
                MulterProvider.deleteImage(imageValue, "comment");
                MulterProvider.deleteImage(imageValue, "comment-resized");
            }

            await this.commentRepository.deleteComment(conn, commentId);

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            await conn.release();
        }
    };

    public updateComment = async (
        userId: number,
        comment: string,
        imageLocation: string | null,
        commentId: number,
    ): Promise<ICommentPacket[]> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            const date = new Date().toISOString().slice(0, 19).replace("T", " ");

            await conn.beginTransaction();

            const isExists = await this.authRepository.isExistsById(conn, userId);
            if (isExists === false) throw new NotFoundException(`이미 탈퇴한 사용자의 토큰입니다.`);

            const isAuthenticated = await this.commentRepository.isAuthenticated(conn, userId, commentId);
            if (!isAuthenticated) throw new Error("내가 작성한 코멘트가 아닙니다.");

            const findCommentById: ICommentPacket[] = await this.commentRepository.findCommentByCommentId(
                conn,
                commentId,
            );
            const findCommentResult = findCommentById;
            const imageValue = findCommentResult !== null ? findCommentResult[0].image_url?.split("/")[4] : null;

            if (imageValue !== null && imageValue !== "undefined" && typeof imageValue === "string") {
                MulterProvider.deleteImage(imageValue, "comment");
                MulterProvider.deleteImage(imageValue, "comment-resized");
            }

            const updateComment = await this.commentRepository.updateComment(conn, comment, imageLocation, commentId);

            await conn.commit();

            return findCommentById;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            await conn.release();
        }
    };

    public getComments = async (recipeId: number, page: number, count: number): Promise<ICommentPacket[]> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const findRecipeById: boolean = await this.recipeRepository.findRecipeById(conn, recipeId);

            if (!findRecipeById) throw new Error("존재하지 않는 레시피입니다.");

            const getComments: ICommentPacket[] = await this.commentRepository.getComments(conn, recipeId, page, count);

            return getComments;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };
}
