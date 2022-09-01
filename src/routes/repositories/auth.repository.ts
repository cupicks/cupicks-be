import {} from "models/dtos/user/user.dto";
import { IUserPacket } from "models/packets/i.user.packet";
import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { SignupUserDto } from "../../models/_.loader";

export class AuthRepository {
    // 있는 지만 확인하는 것 : boolean = isExists
    // 찾는 것 : 해당 대상을 꺼내고 = find
    // 생성 = create
    // 수정 = update
    // 삭제 = delete

    // find모델
    // findUserByUserId
    // findUserByEmail

    public isExistsByEmail = async (conn: PoolConnection, email: string): Promise<boolean> => {
        // 쿼리문 추가하면 끝
        const isExistsQuery = `SELECT user_id FROM user WHERE email = "${email}";`;
        const isExistsResult = await conn.query<RowDataPacket[][]>(isExistsQuery);

        const rowDataPacket = isExistsResult[0];

        return rowDataPacket?.length === 1;
    };

    public findUserByEmail = async (conn: PoolConnection, email: string): Promise<IUserPacket | null> => {
        const findQuery = `SELECT user_id as userId, email, nickname, password, image_url as imageUrl FROM user WHERE email = "${email}" LIMIT 1;`;
        const findResult = await conn.query<IUserPacket[]>(findQuery);

        const userDataPacket = findResult[0];
        const user = userDataPacket[0];

        return userDataPacket.length !== 1 ? null : user;
    };

    public createUser = async (conn: PoolConnection, userDto: SignupUserDto): Promise<number> => {
        const createUserQuery = userDto.imageUrl
            ? `INSERT INTO user (email, nickname, password, image_url) VALUES ("${userDto.email}", "${userDto.nickname}", "${userDto.password}", "${userDto.imageUrl}");`
            : `INSERT INTO user (email, nickname, password) VALUES ("${userDto.email}", "${userDto.nickname}", "${userDto.password}");`;

        const createdUserResult = await conn.query<ResultSetHeader>(createUserQuery, {});
        const userResultSetHeader = createdUserResult[0];

        const { affectedRows, insertId } = userResultSetHeader;
        if (affectedRows !== 1) throw new Error("부적절한 쿼리문이 실행 된 것 같습니다.");

        const userId = insertId;

        return userId;
    };

    public createUserDetailByUserId = async (conn: PoolConnection, userId: number, date: string): Promise<void> => {
        const createQuery = `INSERT INTO user_detail (user_id, created_at, updated_at) VALUES (${userId}, "${date}", "${date}");`;
        const createdResult = await conn.query<ResultSetHeader>(createQuery);
        const resultSetHeader = createdResult[0];

        const { affectedRows } = resultSetHeader;
        if (affectedRows !== 1) throw new Error("부적절한 쿼리문이 실행 된 것 같습니다.");
    };

    public createUserRefreshTokenRowByUserId = async (conn: PoolConnection, userId: number): Promise<void> => {
        const craeteUserRefreshTokenQuery = `INSERT INTO user_refresh_token (user_id) VALUES (${userId});`;
        const createdUserRefreshTokenResutl = await conn.query<ResultSetHeader>(craeteUserRefreshTokenQuery);

        const userRefreshTokenResultSetHeader = createdUserRefreshTokenResutl[0];
        const { affectedRows } = userRefreshTokenResultSetHeader;
        if (affectedRows !== 1) throw new Error("부적절한 쿼리문이 실행 된 것 같습니다.");
    };

    // update

    public updateUserRefreshTokenRowByUserId = async (conn: PoolConnection, userId: number, refreshToken: string) => {
        console.log(refreshToken.length);
        const updateQuery = `UPDATE user_refresh_token SET refresh_token = "${refreshToken}" WHERE user_id = ${userId};`;
        const updateResult = await conn.query<ResultSetHeader>(updateQuery);
        console.log(updateResult);
    };
}
