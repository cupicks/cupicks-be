import { CreateCommentDto } from "../../models/_.loader";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";

export class CommentRepository {
    public isAuthenticated = async (conn: PoolConnection, userId: number, commentId: number): Promise<any> => {
        const query = `
        SELECT 
            R.user_id AS userId
        FROM 
            (
            SELECT C.comment_id
            FROM comment C
            ) C
        RIGHT JOIN
            (
            SELECT R.user_id, R.comment_id
            FROM recipe_comment R
            ) R
        ON C.comment_id = R.comment_id
        WHERE R.comment_id = ?
        AND R.user_id = ?
        `;

        const [result] = await conn.query<ResultSetHeader>(query, [commentId, userId]);
        const resultSetHeader = result.affectedRows;

        if (resultSetHeader > 1) throw new Error("protected");

        return result;
    };

    public findCommentByCommentId = async (conn: PoolConnection, commentId: number): Promise<any> => {
        const query = `
            SELECT image_url
            FROM comment
            WHERE comment_id = ?
        `;

        const [result] = await conn.query<ResultSetHeader>(query, commentId);

        return result;
    };

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

    public deleteComment = async (conn: PoolConnection, commentId: number): Promise<any> => {
        const query = `
            DELETE FROM comment
            WHERE comment_id = ?;
        `;

        const [result] = await conn.query<ResultSetHeader>(query, [commentId]);

        return result;
    };

    public updateComment = async (
        conn: PoolConnection,
        comment: string,
        imageLocation: string | null,
        commentId: number,
    ): Promise<object> => {
        const query = `
            UPDATE comment
            SET 
                comment = ?, image_url = ?
            WHERE comment_id = ?;
        `;

        const [result] = await conn.query<ResultSetHeader>(query, [comment, imageLocation, commentId]);

        return result;
    };

    public getComments = async (
        conn: PoolConnection,
        recipeId: number,
        page: number,
        count: number,
    ): Promise<object> => {
        const query = `
            SELECT 
                R.user_id AS userId, R.recipe_id AS recipeId,
                C.comment_id AS commentId, C.comment, C.image_url AS imageUrl , C.created_at AS createdAt, C.updated_at AS updatedAt
            FROM recipe_comment R
            JOIN comment C
            ON R.comment_id = C.comment_id
            WHERE R.recipe_id = ?
            LIMIT ?, ?
        `;

        const [result] = await conn.query<ResultSetHeader>(query, [recipeId, page, count]);

        return result;
    };
}
