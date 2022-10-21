import { UserFavorRepository } from "../../../../src/routes/repositories/user.favor.repository";

describe("User Favor Repository", () => {
    let sutRepository: UserFavorRepository;
    beforeEach(() => {
        sutRepository = new UserFavorRepository();
    });

    it("must be defined", () => expect(UserFavorRepository).toBeDefined());

    describe("insertFavorCupSize", () => {
        it("must be defined", () => expect(sutRepository.insertFavorCupSize).toBeDefined());
    });

    describe("insertFavorTemperature", () => {
        it("must be defined", () => expect(sutRepository.insertFavorTemperature).toBeDefined());
    });

    describe("insertFavorCategory", () => {
        it("must be defined", () => expect(sutRepository.insertFavorCategory).toBeDefined());
    });

    describe("insertDisfavorCupSize", () => {
        it("must be defined", () => expect(sutRepository.insertDisfavorCupSize).toBeDefined());
    });

    describe("insertDisfavorTemperature", () => {
        it("must be defined", () => expect(sutRepository.insertDisfavorTemperature).toBeDefined());
    });

    describe("insertDisfavorCategory", () => {
        it("must be defined", () => expect(sutRepository.insertDisfavorCategory).toBeDefined());
    });
});
