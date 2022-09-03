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
        }
    };

    public deleteComment = async (commentId: number) => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            return await this.commentRepository.deleteComment(conn, commentId);
        } catch (err) {
            console.error(err);
        }
    };
}
