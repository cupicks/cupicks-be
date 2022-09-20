import {
    CreateCommentDto,
    UnkownError,
    UpdateCommentDto,
    DeleteCommentDto,
    GetCommentDto,
} from "../../models/_.loader";
import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { ICommentPacket } from "../../models/_.loader";
import { count } from "console";

export class CommentRepository {
    // IsExists
    public isAuthenticated = async (
        conn: PoolConnection,
        updateAndDeleteCommentDto: UpdateCommentDto | DeleteCommentDto,
    ): Promise<boolean> => {
        const query = `
        SELECT 
        recipe_comment.user_id AS userId
        FROM 
            (
            SELECT comment.comment_id
            FROM comment
            ) comment
        RIGHT JOIN
            (
            SELECT recipe_comment.user_id, recipe_comment.comment_id
            FROM recipe_comment
            ) recipe_comment
        ON comment.comment_id = recipe_comment.comment_id
        WHERE recipe_comment.user_id = ? AND comment.comment_id = ?
        `;

        const [selectResult] = await conn.query<RowDataPacket[]>(query, [
            updateAndDeleteCommentDto.userId,
            updateAndDeleteCommentDto.commentId,
        ]);
        const [commentPackets, _] = selectResult;

        return commentPackets ? true : false;
    };

    // Find

    public findCommentByCommentId = async (conn: PoolConnection, commentId: number): Promise<ICommentPacket[]> => {
        const query = `
            SELECT *
            FROM comment
            WHERE comment_id = ?
        `;

        const selectResult = await conn.query<ICommentPacket[]>(query, commentId);
        const [commentPackets, _] = selectResult;

        return commentPackets;
    };

    // Get

    public getComments = async (conn: PoolConnection, getCommentDto: GetCommentDto): Promise<ICommentPacket[]> => {
        const query = `
        SELECT
            recipe_comment.user_id AS userId, user.nickname AS nickname, user.image_url AS userImageUrl, user.resized_url AS userResizedUrl, recipe_comment.recipe_id AS recipeId,
            comment.comment_id AS commentId, comment.comment, comment.image_url AS imageUrl, comment.resized_url AS resizedUrl , comment.created_at AS createdAt, comment.updated_at AS updatedAt
        FROM recipe_comment
        JOIN comment
        ON recipe_comment.comment_id = comment.comment_id
        RIGHT JOIN user
        ON recipe_comment.user_id = user.user_id
        WHERE recipe_comment.recipe_id = ?
        LIMIT ? OFFSET ?
        `;

        const LIMIT = getCommentDto.count;
        const OFFSET = (getCommentDto.page - 1) * LIMIT;

        const [result] = await conn.query<ICommentPacket[]>(query, [getCommentDto.recipeId, LIMIT, OFFSET]);

        return result;
    };

    // Create

    public createComment = async (conn: PoolConnection, commentDto: CreateCommentDto): Promise<number> => {
        const query = `
            INSERT INTO comment
                (comment, image_url, resized_url)
            VALUES
                (?, ?, ?);
        `;

        const insertResult = await conn.query<ResultSetHeader>(query, [
            commentDto.comment,
            commentDto.imageUrl,
            commentDto.resizedUrl,
        ]);

        const [resultSetHeader, _] = insertResult;
        const { affectedRows, insertId } = resultSetHeader;

        if (affectedRows !== 1) throw new UnkownError("부적절한 쿼리문이 실행된 것 같습니다.", "DATABASE_UNKOWN_QUERY");

        return insertId;
    };

    public createRecipeComment = async (
        conn: PoolConnection,
        commentDto: CreateCommentDto,
        commentId: number,
    ): Promise<number> => {
        const query = `
            INSERT INTO recipe_comment
                (user_id, recipe_id, comment_id)
            VALUES
                (?, ?, ?);
        `;

        const insertResult = await conn.query<ResultSetHeader>(query, [
            commentDto.userId,
            commentDto.recipeId,
            commentId,
        ]);
        const [resultSetHeader, _] = insertResult;
        const { affectedRows, insertId } = resultSetHeader;

        if (affectedRows !== 1) throw new UnkownError("부적절한 쿼리문이 실행된 것 같습니다.", "DATABASE_UNKOWN_QUERY");

        return insertId;
    };

    // Update

    public updateCommentById = async (conn: PoolConnection, updateCommentDto: UpdateCommentDto): Promise<object> => {
        const query = `
            UPDATE comment
            SET 
                comment = ?, image_url = ?, resized_url = ?
            WHERE comment_id = ?;
        `;

        const [result] = await conn.query<ResultSetHeader>(query, [
            updateCommentDto.comment,
            updateCommentDto.imageUrl,
            updateCommentDto.resizedUrl,
            updateCommentDto.commentId,
        ]);

        return result;
    };

    // Delete

    public deleteCommentById = async (conn: PoolConnection, commentId: number): Promise<ResultSetHeader | null> => {
        const query = `
            DELETE FROM comment
            WHERE comment_id = ?;
        `;

        const [result] = await conn.query<ResultSetHeader>(query, [commentId]);

        return result;
    };
}
