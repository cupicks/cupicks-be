import { CreateCommentDto } from "../../models/_.loader";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";

export class CommentRepository {
    public createComment = async (
        conn: PoolConnection,
        commentDto: CreateCommentDto,
        imageLocation: string | null,
    ): Promise<object> => {
        const query = `
            INSERT INTO comment
                (comment, image_url)
            VALUES
                (?, ?);
        `;

        const [result] = await conn.query<ResultSetHeader>(query, [
            commentDto.comment,
            imageLocation === null ? null : imageLocation,
        ]);
        const resultSetHeader = result.affectedRows;

        if (resultSetHeader > 1) throw new Error("protected");

        return result;
    };

    public createRecipeComment = async (
        conn: PoolConnection,
        userId: number,
        recipeId: number,
        commentId: number,
    ): Promise<object> => {
        const query = `
            INSERT INTO recipe_comment
                (user_id, recipe_id, comment_id)
            VALUES
                (?, ?, ?);
        `;

        const [result] = await conn.query<ResultSetHeader>(query, [userId, recipeId, commentId]);
        const resultSetHeader = result.affectedRows;

        if (resultSetHeader > 1) throw new Error("protected");

        return result;
    };
}
