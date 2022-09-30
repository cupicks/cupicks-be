import { PoolConnection } from "mysql2/promise";

export const MockAuthRepository = {
    isExistsByEmailOrNickname: jest.fn(async (conn: PoolConnection, email: string): Promise<boolean> => {
        return true;
    }),
    isExistsByEmail: jest.fn(async (conn: PoolConnection, email: string): Promise<boolean> => {
        return true;
    }),
    isExistsById: jest.fn(async (conn: PoolConnection, userId: number): Promise<boolean> => {
        return true;
    }),
    isExistsByNickname: jest.fn(),
    findUserById: jest.fn(),
    findUserByEmail: jest.fn(),
    findUserByNickname: jest.fn(),
    findUserRefreshTokenById: jest.fn(),
    findUserRefreshTokenByIdLegacy: jest.fn(),
    findAllUser: jest.fn(),
    createUser: jest.fn(),
    createUserLegacy: jest.fn(),
    createUserDetailByUserId: jest.fn(),
    createUserRefreshTokenRowByUserId: jest.fn(),
    updateUserProfile: jest.fn(),
    updateUserRefreshToken: jest.fn(),
    updateUserPassword: jest.fn(),
    updateUserResetPassword: jest.fn(),
    exceedOfResetPasswordSent: jest.fn(),
    updateUserRefreshTokenRowByUserId: jest.fn(),
};
