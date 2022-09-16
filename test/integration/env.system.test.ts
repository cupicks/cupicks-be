import * as EnvFile from "../../src/models/env/env";
import { EnvProvider } from "../../src/modules/providers/env.provider";

/**
 * 환경 변수 시스템의 참여자는 다음과 같습니다.
 *
 * 1. Env
 * 2. EnvProvider
 */
describe("EnvSystem's using Env and EnvProvider", () => {
    /** Env, EnvProvider 는 무조건 정의 되어야 합니다. */
    it("Env must be defined", () => expect(EnvFile.Env).toBeDefined());
    it("EnvProvider must be defined", () => expect(EnvProvider).toBeDefined());

    /**
     * EnvProvider 의 getEnvInstance 메서드는 Env 프로로타입을 리턴합니다.
     *
     * - 전제조건 : EnvProvider.init(key: NODE_ENV) 호출이 전제되어야 합니다.
     *   - key === 'dev' : dotenv 가 process.env 안에 key-value 를 넣어줍니다.
     *   - key === 'test' : dotenv 가 proess.env 안에 key-value 를 넣어줍니다.
     *   - key === 'prod' : pm2 가 process.env 안에 key-value 를 넣어줍니다.
     *   - 테스트는 pm2 를 사용하지않아서0, prod 는 무조건 에러가 발생합니다.
     */
    describe("EnvProvider.prototype.getEnvInstance should return Env.prototype", () => {
        let sutEnvConstructor: jest.SpyInstance<EnvFile.Env>;

        beforeEach(() => {
            sutEnvConstructor = jest.spyOn(EnvFile, "Env");
        });

        it("When 'dev', EnvSystem should return Env.prototype", () => {
            EnvProvider.init("dev");

            const envProvider: EnvProvider = new EnvProvider();
            const sutEnv: EnvFile.Env = envProvider.getEnvInstance();

            expect(sutEnvConstructor).toBeCalled();
            expect(sutEnvConstructor).toBeCalledTimes(1);

            expect(sutEnv).toBeInstanceOf(EnvFile.Env);
        });

        it("When 'test', EnvSystem should return Env.prototype", () => {
            EnvProvider.init("test");

            const envProvider: EnvProvider = new EnvProvider();
            const sutEnv: EnvFile.Env = envProvider.getEnvInstance();

            expect(sutEnvConstructor).toBeCalled();
            expect(sutEnvConstructor).toBeCalledTimes(1);

            expect(sutEnv).toBeInstanceOf(EnvFile.Env);
        });

        afterEach(() => {
            jest.clearAllMocks();
        });
    });

    /**
     * Env 프로토타입은 11 개의 프로퍼티를 가지고 있습니다.
     *
     * - 전제조건 : EnvProvider.init(key: NODE_ENV) 호출이 전제되어야 합니다.
     */
    describe("Env.prototype should return 11 prototype", () => {
        //

        beforeEach(() => {
            EnvProvider.init("test");
        });

        it("When 'test', Env.prototpye", () => {
            const env = new EnvFile.Env();

            expect(Object.keys(env).length).toBe(11);
            expect(env.PORT).not.toBeUndefined();
            expect(env.SALT).not.toBeUndefined();

            expect(env.URL).not.toBeUndefined();
            expect(env.JWT).not.toBeUndefined();
            expect(env.MYSQL).not.toBeUndefined();
            expect(env.S3).not.toBeUndefined();
            expect(env.SES).not.toBeUndefined();
        });
    });
});
