import * as EnvFile from "../../../../src/models/env/env";
import { EnvProvider } from "../../../../src/modules/providers/env.provider";

/**
 * 환경 변수는
 *
 * - 1 깊이에 11 개의 속성을 가지고 있습니다.
 */
describe("Env", () => {
    beforeEach(() => {
        EnvProvider.init("test");
    });

    it("Env must be defined", () => expect(EnvFile.Env).toBeDefined());

    // it("Depth 1 : Env has 11 properties", () => {
    //     const env = new EnvFile.Env();

    //     expect(Object.keys(env).length).toBe(11);
    //     expect(env.PORT).not.toBeUndefined();
    //     expect(env.SALT).not.toBeUndefined();

    //     expect(env.CORS_ORIGIN_LIST).not.toBeUndefined();
    //     expect(env.CORS_ORIGIN_LIST).toBeInstanceOf(Object);
    //     expect(env.CORS_ORIGIN_LIST).toBeInstanceOf(Array);

    //     expect(env.S3).not.toBeUndefined();
    //     expect(env.S3).toBeInstanceOf(Object);

    //     expect(env.SES).not.toBeUndefined();
    //     expect(env.SES).toBeInstanceOf(Object);

    //     expect(env.JWT).not.toBeUndefined();
    //     expect(env.JWT).toBeInstanceOf(Object);

    //     expect(env.MYSQL).not.toBeUndefined();
    //     expect(env.MYSQL).toBeInstanceOf(Object);
    // });

    // it("Depth 2 : Env has 11 properties", () => {
    //     const env = new EnvFile.Env();

    //     expect(typeof env.CORS_ORIGIN_LIST[0]).toBe("string");
    //     expect(typeof env.CORS_ORIGIN_LIST[1]).toBe("string");
    //     expect(Object.keys(env.CORS_ORIGIN_LIST).length).toBe(2);

    //     expect(typeof env.S3.S3_ACCESS_KEY).toBe("string");
    //     expect(typeof env.S3.S3_SECRET_KEY).toBe("string");
    //     expect(typeof env.S3.REGION).toBe("string");
    //     expect(typeof env.S3.BUCKET).toBe("string");
    //     expect(Object.keys(env.S3).length).toBe(4);

    //     expect(typeof env.SES.SES_API_VERSION).toBe("string");
    //     expect(typeof env.SES.SES_API_REGION).toBe("string");
    //     expect(typeof env.SES.SES_ACCESS_KEY).toBe("string");
    //     expect(typeof env.SES.SES_SECRET_KEY).toBe("string");
    //     expect(typeof env.SES.SES_SENDER_EMAIL).toBe("string");
    //     expect(Object.keys(env.SES).length).toBe(5);

    //     expect(typeof env.JWT.ACCESS_EXPIRED_IN).toBe("string");
    //     expect(typeof env.JWT.REFRESH_EXPIRED_IN).toBe("string");
    //     expect(typeof env.JWT.VERIFY_EXPIRED_IN).toBe("string");
    //     expect(typeof env.JWT.HASH_ALGOIRHTM).toBe("string");
    //     expect(typeof env.JWT.HASH_PRIVATE_PEM_KEY).toBe("string");
    //     expect(typeof env.JWT.HASH_PUBLIC_PEM_KEY).toBe("string");
    //     expect(typeof env.JWT.HASH_PASSPHRASE).toBe("string");
    //     expect(Object.keys(env.JWT).length).toBe(7);

    //     expect(typeof env.MYSQL.HOST).toBe("string");
    //     expect(typeof env.MYSQL.USER).toBe("string");
    //     expect(typeof env.MYSQL.DATABASE).toBe("string");
    //     expect(typeof env.MYSQL.PASSWORD).toBe("string");
    //     expect(typeof env.MYSQL.CONNECTION_LIMIT).toBe("number");
    //     expect(Object.keys(env.MYSQL).length).toBe(5);
    // });
});
