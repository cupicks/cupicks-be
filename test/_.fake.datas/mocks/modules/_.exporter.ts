import { MockDtoFactory } from "./factories/mock.dto.factory";

import { MockRandomGenerator } from "./generators/mock.random.generator";

import { MockAwsSesProvider } from "./providers/mock.aws.ses.provider";
import { MockBcryptProvider } from "./providers/mock.bcrypt.provider";
import { MockDayjsProvider } from "./providers/mock.dayjs.provider";
import { MockJwtProvider } from "./providers/mock.jwt.provider";
import { MockMysqlProvider, getMockConnection } from "./providers/mock.mysql.provider";

const Factories = {
    MockDtoFactory,
};
const Generators = {
    MockRandomGenerator,
};

const Providers = {
    MockAwsSesProvider,
    MockBcryptProvider,
    MockDayjsProvider,
    MockJwtProvider,
    MockMysqlProvider,
    getMockConnection,
};

export { Factories, Generators, Providers };
