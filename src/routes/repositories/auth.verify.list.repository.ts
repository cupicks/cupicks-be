import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { UnkownError, IUserVerifyListPacket } from "../../models/_.loader";

export class AuthVerifyListRepository {
    public isExistsbyEmail = async (conn: PoolConnection, email: string): Promise<boolean> => {
        // 쿼리문 추가하면 끝
        const isExistsQuery = `SELECT user_verify_list_id FROM user_verify_list WHERE email = "${email}";`;
        const isExistsResult = await conn.query<RowDataPacket[][]>(isExistsQuery);

        const rowDataPacket = isExistsResult[0];

        return rowDataPacket?.length === 1;
    };

    public isExistsByNicknameExceptEmail = async (conn: PoolConnection, email: string, nickname: string) => {
        const isExistsQuery = `SELECT user_verify_list_id FROM user_verify_list WHERE nickname = "${nickname}" AND email != "${email}";`;
        const isExistsResult = await conn.query<RowDataPacket[][]>(isExistsQuery);

        const rowDataPacket = isExistsResult[0];

        return rowDataPacket?.length === 1;
    };

    public findVerifyListByEmail = async (
        conn: PoolConnection,
        email: string,
    ): Promise<IUserVerifyListPacket | null> => {
        const findQuery = `SELECT 
            user_verify_list_id as userVerifyListId,
            email as email,
            email_verified_date as emailVerifiedDate,
            email_verified_token as emailVerifiedToken,
            email_verified_code as emailVerifiedCode,
            is_verified_email as isVerifiedEmail,
            nickname as nickname,
            nickname_verified_date as nicknameVerifiedDate,
            nickname_verified_token as nicknameVerifiedToken,
            is_verified_nickname as isVerifiedNickname
        FROM user_verify_list WHERE email = "${email}" LIMIT 1;`;
        const findReulst = await conn.query<IUserVerifyListPacket[]>(findQuery);

        const [userVerifyListPacket, _] = findReulst;

        return userVerifyListPacket.length !== 1 ? null : userVerifyListPacket[0];
    };

    // create

    public createVerifyListByEmailAndCode = async (
        conn: PoolConnection,
        email: string,
        emailVerifyCode: string,
    ): Promise<void> => {
        const insertQuery = `INSERT INTO user_verify_list (email, email_verified_code, is_verified_email) VALUES ("${email}", "${emailVerifyCode}", ${false});`;
        const insertResult = await conn.query<ResultSetHeader>(insertQuery);

        const [resultSetHeader, _] = insertResult;

        const { affectedRows } = resultSetHeader;

        if (affectedRows !== 1) throw new UnkownError("부적절한 쿼리문이 실행 된 것 같습니다.");
    };

    // update

    public updateVerifyListByIdAndCode = async (
        conn: PoolConnection,
        userVerifyId: number,
        emailVerifyCode: string,
    ): Promise<void> => {
        const updateQuery = `UPDATE user_verify_list SET email_verified_code = "${emailVerifyCode}" WHERE user_verify_list_id = ${userVerifyId};`;
        const updateResult = await conn.query<ResultSetHeader>(updateQuery);

        const [resultSetHeader, _] = updateResult;

        const { affectedRows } = resultSetHeader;

        if (affectedRows !== 1) throw new UnkownError("부적절한 쿼리문이 실행 된 것 같습니다.");
    };

    public updateVerifyListByEmailAndEmailVerifyToken = async (
        conn: PoolConnection,
        email: string,
        emailVerifiedDate: string,
        emailVerifiedToken: string,
    ): Promise<void> => {
        const updateQuery = `UPDATE user_verify_list SET 
                email_verified_date = "${emailVerifiedDate}", email_verified_token = "${emailVerifiedToken}", is_verified_email = ${true}
            WHERE email = "${email}";`;

        const updateResult = await conn.query<ResultSetHeader>(updateQuery);

        const [resultSetHeader, _] = updateResult;

        const { affectedRows } = resultSetHeader;

        if (affectedRows !== 1) throw new UnkownError("부적절한 쿼리문이 실행 된 것 같습니다.");
    };

    public updateVerifyListByNickname = async (
        conn: PoolConnection,
        email: string,
        nickname: string,
        nicknameVerifiedDate: string,
        nicknameVerifedToken: string,
    ): Promise<void> => {
        const updateQuery = `UPDATE user_verify_list
                SET nickname = "${nickname}", nickname_verified_date = "${nicknameVerifiedDate}", nickname_verified_token = "${nicknameVerifedToken}", is_verified_nickname = ${true}
            WHERE email = "${email}";`;
        const updateResult = await conn.query<ResultSetHeader>(updateQuery);

        const [resultSetHeader, _] = updateResult;
        const { affectedRows } = resultSetHeader;

        if (affectedRows !== 1) throw new UnkownError("부적절한 쿼리문이 실행된 것 같습니다.");
    };
}