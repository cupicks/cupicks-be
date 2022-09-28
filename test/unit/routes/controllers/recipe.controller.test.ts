// sut
import { RecipeController } from "../../../../src/routes/controllers/recipe.controller";

// type & mocking
import { Request, Response, NextFunction } from "express";
import { mockHttp, mockRoute, mockModule } from "../../../_.fake.datas/mocks/_.loader";
import {
    RecipeDto,
    CreateRecipeDto,
    CommonRecipeDto,
    DeleteRecipeDto,
    GetRecipeDto,
    UpdateRecipeDto,
} from "../../../../src/models/_.loader";
import { RecipeDtoFixtureProvider } from "../../../_.fake.datas/fixture/recipe.dto.fixture.provider";

jest.mock("../../../../src/routes/services/recipe.service", () => {
    return {
        RecipeService: jest.fn().mockImplementation(() => mockRoute.Services.MockRecipeService),
    };
});
jest.mock("../../../../src/modules/factory/dto.factory", () => {
    return {
        DtoFactory: jest.fn().mockImplementation(() => mockModule.Factories.MockDtoFactory),
    };
});

describe("Recipe Controller Test", () => {
    // 컨트롤러 변수 선언
    let sutRecipeController: RecipeController;
    let recipeDtoFixtureProvider: RecipeDtoFixtureProvider;
    let mockRequest: Request, mockResponse: Response, mockNextFunc: NextFunction;

    let mockErrorCode: string, mockErrorMessage: string, mockErrorInstance: Error;

    // beforeAll 단 한번만 실행 (컨트롤러 & 전역변수 & 데이터베이스 연결)
    beforeAll(() => {
        sutRecipeController = new RecipeController();
        recipeDtoFixtureProvider = new RecipeDtoFixtureProvider();

        mockErrorCode = "UNKOWN";
        mockErrorMessage = "Mock Error";
        mockErrorInstance = new Error(mockErrorMessage);
    });

    // 테스트 함수들이 실행되면서 매번 실행 (each)
    beforeEach(() => {
        // RequestHandler Middleware
        mockRequest = mockHttp.getMockRequest();
        mockResponse = mockHttp.getMockResponse();
    });

    // RecipeController 변수 정의 여부 확인
    it("RecipeController be defined", () => expect(RecipeController).toBeDefined());
    // RecipeController 가 의존하고 있는 클래스와 메서드
    it("RecipeController.prototype contain 2 dependencies and 8 methods", () => {
        expect(Object.keys(sutRecipeController).length).toBe(10);

        // RecipeController Dependency Class
        expect(sutRecipeController["recipeService"]).toBeDefined();
        expect(sutRecipeController["dtoFactory"]).toBeDefined();

        // RecipeController Methods
        expect(sutRecipeController.createRecipe).toBeDefined();
        expect(typeof sutRecipeController.createRecipe).toBe("function");

        expect(sutRecipeController.getRecipe).toBeDefined();
        expect(typeof sutRecipeController.getRecipe).toBe("function");

        expect(sutRecipeController.getRecipes).toBeDefined();
        expect(typeof sutRecipeController.getRecipes).toBe("function");

        expect(sutRecipeController.updatedRecipe).toBeDefined();
        expect(typeof sutRecipeController.updatedRecipe).toBe("function");

        expect(sutRecipeController.deleteRecipe).toBeDefined();
        expect(typeof sutRecipeController.deleteRecipe).toBe("function");

        expect(sutRecipeController.likeRecipe).toBeDefined();
        expect(typeof sutRecipeController.likeRecipe).toBe("function");
    });

    describe("RecipeController.prototype.createRecipe", () => {
        let createRecipeDto: CreateRecipeDto;
        let recipeId: number;

        // 테스트 함수들이 실행되면서 매번 실행 (each)
        beforeEach(() => {
            createRecipeDto = recipeDtoFixtureProvider.getCreateRecipeDto();
            recipeId = 1;

            sutRecipeController["dtoFactory"].getCreateRecipeDto = jest.fn(async (): Promise<CreateRecipeDto> => {
                return createRecipeDto;
            });

            sutRecipeController["recipeService"].createRecipe = jest.fn(async (): Promise<number> => {
                return recipeId;
            });
        });

        it("should call res.status(201).json()", async () => {
            await sutRecipeController.createRecipe(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(201);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: true,
                message: "레시피 등록에 성공하셨습니다",
                recipeId: recipeId,
            });
        });

        it("should call res.status(500).json()", async () => {
            sutRecipeController["recipeService"].createRecipe = jest.fn(async (): Promise<number> => {
                throw mockErrorInstance;
            });

            await sutRecipeController.createRecipe(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(500);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: false,
                message: mockErrorInstance.message,
                errorCode: mockErrorCode,
            });
        });
    });

    describe("RecipeController.prototype.getRecipe", () => {
        let getRecipeDto: CommonRecipeDto;
        let recipeDto: RecipeDto;

        beforeEach(() => {
            getRecipeDto = recipeDtoFixtureProvider.getGetRecipeDto();
            recipeDto = recipeDtoFixtureProvider.getRecipeDto({});

            sutRecipeController["dtoFactory"].getCommonRecipeDto = jest.fn(async (): Promise<CommonRecipeDto> => {
                return getRecipeDto;
            });

            sutRecipeController["recipeService"].getRecipe = jest.fn(async (): Promise<RecipeDto> => {
                return recipeDto;
            });
        });

        it("should call res.status(200).json()", async () => {
            await sutRecipeController.getRecipe(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(200);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: true,
                message: "레시피 조회에성공하셨습니다.",
                recipe: recipeDto,
            });
        });

        it("should call res.status(500).json()", async () => {
            sutRecipeController["recipeService"].getRecipe = jest.fn(async (): Promise<RecipeDto> => {
                throw mockErrorInstance;
            });

            await sutRecipeController.getRecipe(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(500);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: false,
                message: mockErrorInstance.message,
                errorCode: mockErrorCode,
            });
        });
    });

    describe("RecipeController.prototype.getRecipes", () => {
        let getRecipesDto: GetRecipeDto;
        let recipesDto: RecipeDto[];

        beforeEach(() => {
            getRecipesDto = recipeDtoFixtureProvider.getGetRecipesDto();
            recipesDto = recipeDtoFixtureProvider.getRecipesDto({});

            sutRecipeController["dtoFactory"].getRecipeDto = jest.fn(async (): Promise<GetRecipeDto> => {
                return getRecipesDto;
            });

            sutRecipeController["recipeService"].getRecipes = jest.fn(async (): Promise<RecipeDto[]> => {
                return recipesDto;
            });
        });

        it("should call res.status(200).json()", async () => {
            await sutRecipeController.getRecipes(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(200);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: true,
                message: "레시피 조회에성공하셨습니다.",
                recipeList: recipesDto,
            });
        });

        it("should call res.status(500).json()", async () => {
            sutRecipeController["recipeService"].getRecipes = jest.fn(async (): Promise<RecipeDto[]> => {
                throw mockErrorInstance;
            });

            await sutRecipeController.createRecipe(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(500);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: false,
                message: mockErrorInstance.message,
                errorCode: mockErrorCode,
            });
        });
    });

    describe("RecipeController.prototype.updateRecipe", () => {
        let updateRecipeDto: UpdateRecipeDto;

        beforeEach(() => {
            updateRecipeDto = recipeDtoFixtureProvider.getUpdateRecipeDto();

            sutRecipeController["dtoFactory"].getUpdateRecipeDto = jest.fn(async (): Promise<UpdateRecipeDto> => {
                return updateRecipeDto;
            });

            sutRecipeController["recipeService"].updateRecipe = jest.fn(async (): Promise<number> => {
                return updateRecipeDto.recipeId;
            });
        });

        it("should call res.status(200).json()", async () => {
            await sutRecipeController.updatedRecipe(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(200);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: true,
                message: "레시피 수정에 성공하셨습니다.",
                recipeId: updateRecipeDto.recipeId,
            });
        });

        it("should call res.status(500).json()", async () => {
            sutRecipeController["recipeService"].updateRecipe = await jest.fn((): Promise<number> => {
                throw mockErrorInstance;
            });

            await sutRecipeController.updatedRecipe(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(500);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: false,
                message: mockErrorInstance.message,
                errorCode: mockErrorCode,
            });
        });
    });

    describe("RecipeController.prototype.deleteRecipe", () => {
        let deleteRecipeDto: DeleteRecipeDto;

        beforeEach(() => {
            deleteRecipeDto = recipeDtoFixtureProvider.getDeleteRecipeDto();

            sutRecipeController["dtoFactory"].getDeleteRecipeDto = jest.fn(async (): Promise<DeleteRecipeDto> => {
                return deleteRecipeDto;
            });

            sutRecipeController["recipeService"].deleteRecipe = jest.fn(async (): Promise<boolean> => {
                return true;
            });
        });

        it("should call res.status(200).json()", async () => {
            await sutRecipeController.deleteRecipe(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(200);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: true,
                message: "레시피 삭제에 성공하셨습니다.",
            });
        });

        it("should call res.status(500).json()", async () => {
            sutRecipeController["recipeService"].deleteRecipe = await jest.fn((): Promise<boolean> => {
                throw mockErrorInstance;
            });

            await sutRecipeController.updatedRecipe(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(500);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: false,
                message: mockErrorInstance.message,
                errorCode: mockErrorCode,
            });
        });
    });

    describe("RecipeController.prototype.likeRecipe", () => {
        let likeRecipeDto: DeleteRecipeDto;

        beforeEach(() => {
            likeRecipeDto = recipeDtoFixtureProvider.getLikeRecipeDto();

            sutRecipeController["dtoFactory"].getDeleteRecipeDto = jest.fn(async (): Promise<DeleteRecipeDto> => {
                return likeRecipeDto;
            });

            sutRecipeController["recipeService"].likeRecipe = jest.fn(async (): Promise<void> => {
                return;
            });
        });

        it("should call res.status(200).json()", async () => {
            await sutRecipeController.likeRecipe(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(201);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: true,
                message: "좋아요에 성공하셨습니다",
            });
        });

        it("should call res.status(500).json()", async () => {
            sutRecipeController["recipeService"].likeRecipe = await jest.fn((): Promise<void> => {
                throw mockErrorInstance;
            });

            await sutRecipeController.updatedRecipe(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(500);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: false,
                message: mockErrorInstance.message,
                errorCode: mockErrorCode,
            });
        });
    });

    describe("RecipeController.prototype.disLikeRecipe", () => {
        let disLikeRecipe: DeleteRecipeDto;

        beforeEach(() => {
            disLikeRecipe = recipeDtoFixtureProvider.getDisLikeRecipeDto();

            sutRecipeController["dtoFactory"].getDeleteRecipeDto = jest.fn(async (): Promise<DeleteRecipeDto> => {
                return disLikeRecipe;
            });

            sutRecipeController["recipeService"].disLikeRecipe = jest.fn(async (): Promise<void> => {
                return;
            });
        });

        it("should call res.status(200).json()", async () => {
            await sutRecipeController.disLikeRecipe(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(201);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: true,
                message: `좋아요 취소에 성공하셨습니다.`,
            });
        });

        it("should call res.status(500).json()", async () => {
            sutRecipeController["recipeService"].disLikeRecipe = await jest.fn((): Promise<void> => {
                throw mockErrorInstance;
            });

            await sutRecipeController.disLikeRecipe(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(500);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: false,
                message: mockErrorInstance.message,
                errorCode: mockErrorCode,
            });
        });
    });

    afterEach(() => jest.clearAllMocks());
});
