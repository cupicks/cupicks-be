import { CreateCommentDto } from "../../models/_.loader";
import { CommentRepository } from "../repositories/_.exporter";
import { MysqlProvider } from "../../modules/_.loader";

export class CommentService {
    private commentRepository: CommentRepository;
    private mysqlProvider: MysqlProvider;

    constructor() {
        this.commentRepository = new CommentRepository();
        this.mysqlProvider = new MysqlProvider();
    }

    public createComment = async (
        commentDto: CreateCommentDto,
        userId: number,
        recipeId: number,
        imageLocation: string | null,
    ): Promise<any> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            const date = new Date().toISOString().slice(0, 19).replace("T", " ");

            await conn.beginTransaction();

            const createComment = await this.commentRepository.createComment(conn, commentDto, imageLocation);

            const createCommentResult = JSON.stringify(createComment);
            const commentId = JSON.parse(createCommentResult).insertId;

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
            console.error(err);
        } finally {
            await conn.release();
        }
    };

    public deleteComment = async (userId: number, commentId: number): Promise<any> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const result = await this.commentRepository.isAuthenticated(conn, userId, commentId);

            if (result.length <= 0) throw new Error("존재하지 않는 댓글입니다.");

            const isAuthenticated: number = result[0]!.userId as number;

            if (userId !== isAuthenticated) throw new Error("내가 작성한 댓글이 아닙니다.");

            await conn.commit();

            return await this.commentRepository.deleteComment(conn, commentId);
        } catch (err) {
            await conn.rollback();
            console.error(err);
        } finally {
            await conn.release();
        }
    };

    public updateComment = async (
        userId: number,
        comment: string,
        imageLocation: string | null,
        commentId: number,
    ): Promise<any> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const result = await this.commentRepository.isAuthenticated(conn, userId, commentId);

            console.log(result);
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            await conn.release();
        }
    };
}
