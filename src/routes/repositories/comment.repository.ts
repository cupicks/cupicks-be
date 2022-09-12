import { CreateCommentDto, UnkownError } from "../../models/_.loader";
import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { ICommentPacket } from "../../models/_.loader";

export class CommentRepository {
    public isAuthenticated = async (conn: PoolConnection, userId: number, commentId: number): Promise<boolean> => {
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
        WHERE R.user_id = ? AND C.comment_id = ? 
        `;

        const [selectResult] = await conn.query<RowDataPacket[]>(query, [userId, commentId]);
        const [commentPackets, _] = selectResult;

        return commentPackets ? true : false;
    };

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

    public createComment = async (
        conn: PoolConnection,
        commentDto: CreateCommentDto,
        imageLocation: string | null,
    ): Promise<number> => {
        const query = `
            INSERT INTO comment
                (comment, image_url)
            VALUES
                (?, ?);
        `;

        const insertResult = await conn.query<ResultSetHeader>(query, [
            commentDto.comment,
            imageLocation === null ? null : imageLocation,
        ]);
        const [resultSetHeader, _] = insertResult;
        const { affectedRows, insertId } = resultSetHeader;

        if (affectedRows !== 1) throw new UnkownError("부적절한 쿼리문이 실행 된 것 같습니다.");

        return insertId;
    };

    public createRecipeComment = async (
        conn: PoolConnection,
        userId: number,
        recipeId: number,
        commentId: number,
    ): Promise<number> => {
        const query = `
            INSERT INTO recipe_comment
                (user_id, recipe_id, comment_id)
            VALUES
                (?, ?, ?);
        `;

        const insertResult = await conn.query<ResultSetHeader>(query, [userId, recipeId, commentId]);
        const [resultSetHeader, _] = insertResult;
        const { affectedRows, insertId } = resultSetHeader;

        if (affectedRows !== 1) throw new UnkownError("부적절한 쿼리문이 실행 된 것 같습니다.");

        return insertId;
    };

    public deleteComment = async (conn: PoolConnection, commentId: number): Promise<ResultSetHeader | null> => {
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
    ): Promise<ICommentPacket[]> => {
        const query = `
        SELECT 
            R.user_id AS userId, U.nickname AS nickname, R.recipe_id AS recipeId,
            C.comment_id AS commentId, C.comment, C.image_url AS imageUrl , C.created_at AS createdAt, C.updated_at AS updatedAt
        FROM recipe_comment R
        JOIN comment C
        ON R.comment_id = C.comment_id
        LEFT JOIN user U
        ON R.user_id = U.user_id
        WHERE R.recipe_id = ?
        LIMIT ?, ?
        `;

        const [result] = await conn.query<ICommentPacket[]>(query, [recipeId, page, count]);

        return result;
    };
}
