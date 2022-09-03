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

    public createComment = async (commentDto: CreateCommentDto, userId: number, recipeId: number): Promise<any> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const createComment = await this.commentRepository.createComment(conn, commentDto);

            const createCommentResult = JSON.stringify(createComment);
            const commentId = JSON.parse(createCommentResult).insertId;

            const createRecipeComment = await this.commentRepository.createRecipeComment(
                conn,
                userId,
                recipeId,
                commentId,
            );

            console.log(`comment dto ${JSON.stringify(commentDto)}`);

            await conn.commit();
            return createRecipeComment;
        } catch (err) {
            await conn.rollback();
            console.error(err);
        }
    };
}
