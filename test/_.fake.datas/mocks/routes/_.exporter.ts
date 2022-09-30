import { MockAuthService } from "./services/mock.auth.service";
import { MockAuthRepository } from "./repositories/mock.auth.repository";
import { MockAuthVerifyListRepository } from "./repositories/mock.auth.verify.list.repository";
import { MockUserCategoryRepository } from "./repositories/mock.user.category.repository";

const Services = {
    MockAuthService,
};
const Repositories = {
    MockAuthRepository,
    MockAuthVerifyListRepository,
    MockUserCategoryRepository,
};

export { Services, Repositories };
