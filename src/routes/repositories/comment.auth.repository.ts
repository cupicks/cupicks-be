import { CreateCommentDto } from "../../models/_.loader";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";

export class CommentRepository {
    public createComment = async (conn: PoolConnection, commentDto: CreateCommentDto): Promise<any> => {
        const query = `
            INSERT INTO comment
                (comment, image_url)
            VALUES
                ("${commentDto.comment}", "${commentDto.imageValue === undefined ? "이미지" : null}");
        `;

        const [result] = await conn.query<ResultSetHeader>(query);

        return result;
    };

    public createRecipeComment = async (
        conn: PoolConnection,
        userId: number,
        recipeId: number,
        commentId: number,
    ): Promise<any> => {
        const query = `
            INSERT INTO recipe_comment
                (user_id, recipe_id, comment_id)
            VALUES
                (${userId}, ${recipeId}, ${commentId});
        `;

        const [result] = await conn.query<ResultSetHeader>(query);

        return result;
    };
}
