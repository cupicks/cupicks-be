// sut
import { RecipeService } from "../../../../src/routes/services/recipe.service";

// arrange
import { TNODE_ENV } from "../../../../src/constants/_.loader";
import {
    NotFoundException,
    BadRequestException,
    IngredientDto,
    IIngredientDto,
    GetRecipeDto,
    UpdateRecipeDto,
    CommonRecipeDto,
    IRecipeCombinedPacket,
    RecipeDto,
    DeleteRecipeDto,
    CreateRecipeDto,
    Env,
} from "../../../../src/models/_.loader";
import { EnvProvider, MysqlProvider } from "../../../../src/modules/_.loader";

// arrange as mocking
import { mockModule } from "../../../_.fake.datas/mocks/_.loader";
import { RecipeDtoFixtureProvider, PacketFixtureProvider } from "../../../_.fake.datas/fixture/_.exporter";

jest.mock("../../../../src/modules/providers/mysql.provider", () => {
    return {
        MysqlProvider: jest.fn().mockImplementation(() => mockModule.Providers.MockMysqlProvider),
    };
});

describe("Auth Service Test", () => {
    let sutRecipeService: RecipeService;
    let recipeDtoFixtureProvider: RecipeDtoFixtureProvider;
    // packet.fixture.provider
    let MODE: TNODE_ENV, ENV: Env;

    beforeAll(async () => {
        recipeDtoFixtureProvider = new RecipeDtoFixtureProvider();
        // packet.fixture.provider

        MODE = "test";
        EnvProvider.init(MODE);
        ENV = new EnvProvider().getEnvInstance();

        sutRecipeService = new RecipeService();
    });

    beforeEach(() => {
        sutRecipeService["mysqlProvider"].getConnection = mockModule.Providers.getMockConnection;
    });

    it("RecipeService must be defined", () => expect(RecipeService).toBeDefined());
    it("RecipeService.prototype contain 4 dependencies and 7 methods", () => {
        expect(Object.keys(sutRecipeService).length).toBe(11);

        // 협력자
        expect(sutRecipeService["mysqlProvider"]).toBeDefined();

        expect(sutRecipeService["recipeRepository"]).toBeDefined();
        expect(sutRecipeService["recipeIngredientRepository"]).toBeDefined();
        expect(sutRecipeService["authRepository"]).toBeDefined();

        // 메서드
        expect(sutRecipeService.createRecipe).toBeDefined();
        expect(typeof sutRecipeService.createRecipe).toBe("function");

        expect(sutRecipeService.getRecipe).toBeDefined();
        expect(typeof sutRecipeService.getRecipe).toBe("function");

        expect(sutRecipeService.getRecipes).toBeDefined();
        expect(typeof sutRecipeService.getRecipes).toBe("function");

        expect(sutRecipeService.updateRecipe).toBeDefined();
        expect(typeof sutRecipeService.updateRecipe).toBe("function");

        expect(sutRecipeService.deleteRecipe).toBeDefined();
        expect(typeof sutRecipeService.deleteRecipe).toBe("function");

        expect(sutRecipeService.likeRecipe).toBeDefined();
        expect(typeof sutRecipeService.likeRecipe).toBe("function");

        expect(sutRecipeService.disLikeRecipe).toBeDefined();
        expect(typeof sutRecipeService.disLikeRecipe).toBe("function");
    });

    describe("RecipeService.prototype.createRecipe", () => {
        let createRecipeDto: CreateRecipeDto;
        let recipeId: number;

        beforeEach(() => {
            recipeId = 1;

            createRecipeDto = recipeDtoFixtureProvider.getCreateRecipeDto();
        });

        it("should throw RECIPE-001, 존재하지 않는 레시피입니다.", async () => {
            const jestFunc = jest.fn();
            jestFunc.mockReturnValue(false);
            sutRecipeService["authRepository"].isExistsById = jestFunc;

            try {
                await sutRecipeService.createRecipe(createRecipeDto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err).toBeInstanceOf(NotFoundException);

                expect(err instanceof NotFoundException && err.statusCode).toBe(404);
                expect(err instanceof NotFoundException && err.message).toBe(
                    "이미 탈퇴한 사용자의 AccessToken 입니다.",
                );
                expect(err instanceof NotFoundException && err.errorCode).toBe("AUTH-007-01");
            }
        });

        it("should return recipeId", async () => {
            const jestFunc = jest.fn();
            jestFunc.mockReturnValue(true);
            sutRecipeService["authRepository"].isExistsById = jestFunc;
        });
    });
});
