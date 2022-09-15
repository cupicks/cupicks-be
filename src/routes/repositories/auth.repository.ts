import { FieldPacket, PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {
    SignupUserDto,
    IUserPacket,
    IUserRefresthTokenPacket,
    EditProfileDto,
    BadRequestException,
    UnkownError,
} from "../../models/_.loader";

export class AuthRepository {
    // 있는 지만 확인하는 것 : boolean = isExists
    // 찾는 것 : 해당 대상을 꺼내고 = find
    // 생성 = create
    // 수정 = update
    // 삭제 = delete

    // find모델
    // findUserByUserId
    // findUserByEmail

    public isExistsByEmailOrNickname = async (conn: PoolConnection, email: string, nickname: string) => {
        const isExistsQuery = `SELECT user_id FROM user WHERE email = "${email}" OR nickname = "${nickname}";`;
        const isExistsResult = await conn.query<RowDataPacket[][]>(isExistsQuery);

        const [rowDataPacket, _] = isExistsResult;
        return rowDataPacket?.length === 1;
    };

    public isExistsByEmail = async (conn: PoolConnection, email: string): Promise<boolean> => {
        // 쿼리문 추가하면 끝
        const isExistsQuery = `SELECT user_id FROM user WHERE email = "${email}";`;
        const isExistsResult = await conn.query<RowDataPacket[][]>(isExistsQuery);

        const rowDataPacket = isExistsResult[0];

        return rowDataPacket?.length === 1;
    };

    public isExistsById = async (conn: PoolConnection, userId: number): Promise<boolean> => {
        // 쿼리문 추가하면 끝
        const isExistsQuery = `SELECT user_id FROM user WHERE user_id = ${userId};`;
        const isExistsResult = await conn.query<RowDataPacket[][]>(isExistsQuery);

        const rowDataPacket = isExistsResult[0];

        return rowDataPacket?.length === 1;
    };

    public isExistsByNickname = async (conn: PoolConnection, nickname: string): Promise<boolean> => {
        // 쿼리문 추가하면 끝
        const isExistsQuery = `SELECT user_id FROM user WHERE nickname = "${nickname}";`;
        const isExistsResult = await conn.query<RowDataPacket[][]>(isExistsQuery);

        const rowDataPacket = isExistsResult[0];

        return rowDataPacket?.length === 1;
    };

    // find

    public findUserById = async (conn: PoolConnection, userId: number): Promise<IUserPacket | null> => {
        const findQuery = `SELECT user_id as userId, email, nickname, password, image_url as imageUrl FROM user WHERE user_id = ${userId} LIMIT 1;`;
        const findResult = await conn.query<IUserPacket[]>(findQuery);

        const userDataPacket = findResult[0];
        const user = userDataPacket[0];

        return userDataPacket.length !== 1 ? null : user;
    };

    public findUserByEmail = async (conn: PoolConnection, email: string): Promise<IUserPacket | null> => {
        const findQuery = `SELECT
                user_id as userId,
                email,
                nickname,
                password,
                image_url as imageUrl,
                reset_password_token as resetPasswordToken,
                reset_password_date as resetPasswordDate,
                current_password_sent_count as currentPasswordSentCount,
                password_sent_exceeding_date as passwordSentExceedingDate,
                is_exeeded_of_password_sent as isExeededOfPasswordSent
            FROM user
            WHERE email = "${email}" LIMIT 1;`;
        const findResult = await conn.query<IUserPacket[]>(findQuery);

        const userDataPacket = findResult[0];
        const user = userDataPacket[0];

        return userDataPacket.length !== 1 ? null : user;
    };

    public findUserByNickname = async (conn: PoolConnection, nickname: string): Promise<IUserPacket | null> => {
        const findQuery = `SELECT user_id as userId, email, nickname, password, image_url as imageUrl FROM user WHERE nickname = "${nickname}" LIMIT 1;`;
        const findResult = await conn.query<IUserPacket[]>(findQuery);

        const userDataPacket = findResult[0];
        const user = userDataPacket[0];

        return userDataPacket.length !== 1 ? null : user;
    };

    public findUserRefreshTokenById = async (
        conn: PoolConnection,
        userId: number,
    ): Promise<IUserRefresthTokenPacket | null> => {
        const findQuery = `SELECT user_id as userId, refresh_token as refreshToken FROM user WHERE user_id = ${userId};`;
        const findResult = await conn.query<IUserRefresthTokenPacket[]>(findQuery);

        const userTokenPacket = findResult[0];
        const userToken = userTokenPacket[0];

        return userTokenPacket?.length !== 1 ? null : userToken;
    };

    /** @deprecated */
    public findUserRefreshTokenByIdLegacy = async (
        conn: PoolConnection,
        userId: number,
    ): Promise<IUserRefresthTokenPacket | null> => {
        const findQuery = `SELECT user_id as userId, refresh_token as refreshToken FROM user_refresh_token WHERE user_id = ${userId};`;
        const findResult = await conn.query<IUserRefresthTokenPacket[]>(findQuery);

        const userTokenPacket = findResult[0];
        const userToken = userTokenPacket[0];

        return userTokenPacket?.length !== 1 ? null : userToken;
    };

    public findAllUser = async (conn: PoolConnection) => {
        const findQuery = `SELECT user_id as userId, email, nickname, password, image_url as imageUrl FROM user LIMIT 30;`;
        const findResult = await conn.query<IUserPacket[]>(findQuery);
        const userDataPacket = findResult[0];

        return userDataPacket;
    };

    // create

    public createUser = async (
        conn: PoolConnection,
        userDto: {
            email: string;
            nickname: string;
            password: string;
            imageGroup: {
                imageUrl: string | undefined;
                resizedUrl: string | undefined;
            };
        },
        date: string,
        userVerifyListId: number,
    ): Promise<number> => {
        const {
            email,
            imageGroup: { imageUrl, resizedUrl },
            nickname,
            password,
        } = userDto;

        let insertReuslt: [ResultSetHeader, FieldPacket[]];
        if (userDto.imageGroup) {
            const insertQuery = `INSERT INTO user (email, nickname, password, image_url, resized_url, created_at, updated_at, user_verify_list_id) VALUES (?,?,?,?,?,?,?,?)`;
            insertReuslt = await conn.query<ResultSetHeader>(insertQuery, [
                email,
                nickname,
                password,
                imageUrl,
                resizedUrl,
                date,
                date,
                userVerifyListId,
            ]);
        } else {
            const insertQuery = `INSERT INTO user (email, nickname, password, created_at, updated_at, user_verify_list_id) VALUES (?,?,?,?,?,?)`;
            insertReuslt = await conn.query<ResultSetHeader>(insertQuery, [
                email,
                nickname,
                password,
                date,
                date,
                userVerifyListId,
            ]);
        }

        const [resultSetHeader] = insertReuslt;
        const { affectedRows, insertId } = resultSetHeader;

        if (affectedRows !== 1) throw new UnkownError("부적절한 쿼리문이 실행 된 것 같습니다.");
        return insertId;
    };

    /** @deprecated */
    public createUserLegacy = async (
        conn: PoolConnection,
        userDto: {
            email: string;
            nickname: string;
            password: string;
            imageUrl: string;
        },
    ): Promise<number> => {
        const createUserQuery = userDto.imageUrl
            ? `INSERT INTO user (email, nickname, password, image_url) VALUES ("${userDto.email}", "${userDto.nickname}", "${userDto.password}", "${userDto.imageUrl}");`
            : `INSERT INTO user (email, nickname, password) VALUES ("${userDto.email}", "${userDto.nickname}", "${userDto.password}");`;

        const createdUserResult = await conn.query<ResultSetHeader>(createUserQuery, {});
        const userResultSetHeader = createdUserResult[0];

        const { affectedRows, insertId } = userResultSetHeader;
        if (affectedRows !== 1) throw new UnkownError("부적절한 쿼리문이 실행 된 것 같습니다.");

        const userId = insertId;

        return userId;
    };

    /** @deprecated */
    public createUserDetailByUserId = async (conn: PoolConnection, userId: number, date: string): Promise<void> => {
        const createQuery = `INSERT INTO user_detail (user_id, created_at, updated_at) VALUES (${userId}, "${date}", "${date}");`;
        const createdResult = await conn.query<ResultSetHeader>(createQuery);
        const resultSetHeader = createdResult[0];

        const { affectedRows } = resultSetHeader;
        if (affectedRows !== 1) throw new Error("부적절한 쿼리문이 실행 된 것 같습니다.");
    };

    /** @deprecated */
    public createUserRefreshTokenRowByUserId = async (conn: PoolConnection, userId: number): Promise<void> => {
        const craeteUserRefreshTokenQuery = `INSERT INTO user_refresh_token (user_id) VALUES (${userId});`;
        const createdUserRefreshTokenResutl = await conn.query<ResultSetHeader>(craeteUserRefreshTokenQuery);

        const userRefreshTokenResultSetHeader = createdUserRefreshTokenResutl[0];
        const { affectedRows } = userRefreshTokenResultSetHeader;
        if (affectedRows !== 1) throw new UnkownError("부적절한 쿼리문이 실행 된 것 같습니다.");
    };

    // update

    private getUpdateUserQuery = (editDto: EditProfileDto): string => {
        const { userId, nickname, password, imageUrl } = editDto;
        if (!nickname && !password && !imageUrl)
            throw new BadRequestException(`회원 정보 수정을 위한 값이 하나도 들어있지 않습니다.`);

        let queryString = `UPDATE user SET`;
        if (nickname) queryString += ` nickname =  "${nickname}",`;
        if (password) queryString += ` password = "${password}",`;
        if (imageUrl) queryString += ` image_url = "${imageUrl}",`;

        queryString = queryString.slice(0, queryString.length - 1);
        queryString += ` WHERE user_id = ${userId};`;

        return queryString;
    };

    public updateUserProfile = async (conn: PoolConnection, editDto: EditProfileDto): Promise<void> => {
        const updateQuery = this.getUpdateUserQuery(editDto);
        const updateResult = await conn.query<ResultSetHeader>(updateQuery);

        const [ResultSetHeader, _] = updateResult;
        const { affectedRows } = ResultSetHeader;
        if (affectedRows !== 1) throw new UnkownError("부적절한 쿼리문이 실행 된 것 같습니다.");
    };

    public updateUserRefreshToken = async (
        conn: PoolConnection,
        userId: number,
        refreshToken: string | null,
    ): Promise<void> => {
        const updateQuery =
            refreshToken === null
                ? `UPDATE user SET refresh_token = "${refreshToken}" WHERE user_id = ${userId};`
                : `UPDATE user SET refresh_token = "${refreshToken}" WHERE user_id = ${userId};`;
        const updateResult = await conn.query<ResultSetHeader>(updateQuery);

        const [ResultSetHeader, _] = updateResult;
        const { affectedRows } = ResultSetHeader;
        if (affectedRows !== 1) throw new UnkownError("부적절한 쿼리문이 실행 된 것 같습니다.");
    };

    public updateUserPassword = async (conn: PoolConnection, email: string, hashedPassword: string): Promise<void> => {
        const updateQuery = `UPDATE user SET password = "${hashedPassword}" WHERE email = "${email}";`;
        const updateResult = await conn.query<ResultSetHeader>(updateQuery);

        const [ResultSetHeader, _] = updateResult;
        const { affectedRows } = ResultSetHeader;
        if (affectedRows !== 1) throw new UnkownError("부적절한 쿼리문이 실행 된 것 같습니다.");
    };

    public updateUserResetPassword = async (
        conn: PoolConnection,
        userId: number,
        resetPasswordToken: string,
        resetPasswordDate: string,
    ) => {
        const updateQuery = `UPDATE
            user
        SET
            reset_password_token = "${resetPasswordToken}",
            reset_password_date = "${resetPasswordDate}",
            current_password_sent_count = current_password_sent_count + 1,
            password_sent_exceeding_date = null,
            is_exeeded_of_password_sent = null
        WHERE
            user_id = ${userId};`;
        const updateResult = await conn.query<ResultSetHeader>(updateQuery);

        const [ResultSetHeader, _] = updateResult;
        const { affectedRows } = ResultSetHeader;
        if (affectedRows !== 1) throw new UnkownError("부적절한 쿼리문이 실행 된 것 같습니다.");
    };

    // exipre
    public exceedOfResetPasswordSent = async (
        conn: PoolConnection,
        userId: number,
        passwordSentExceedingDate: string | null,
    ) => {
        const exceedQuery = `UPDATE
            user
        SET
            reset_password_token = null,
            reset_password_date = null,
            current_password_sent_count = 0,
            password_sent_exceeding_date = "${passwordSentExceedingDate}",
            is_exeeded_of_password_sent = 1
        WHERE
            user_id = ${userId};`;
        const exceedResult = await conn.query<ResultSetHeader>(exceedQuery);

        const [resultSetHeader, _] = exceedResult;
        const { affectedRows } = resultSetHeader;

        if (affectedRows !== 1) throw new UnkownError("부적절한 쿼리문이 실행된 것 같습니다.");
    };

    /** @deprecated */
    public updateUserRefreshTokenRowByUserId = async (conn: PoolConnection, userId: number, refreshToken: string) => {
        console.log(refreshToken.length);
        const updateQuery = `UPDATE user_refresh_token SET refresh_token = "${refreshToken}" WHERE user_id = ${userId};`;
        const updateResult = await conn.query<ResultSetHeader>(updateQuery);

        const [ResultSetHeader, _] = updateResult;
        const { affectedRows } = ResultSetHeader;
        if (affectedRows !== 1) throw new UnkownError("부적절한 쿼리문이 실행 된 것 같습니다.");
    };
}
