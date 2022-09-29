// sut
import { RandomGenerator } from "../../../../src/modules/generator/random.generator";

// mocks
import { faker } from "@faker-js/faker";

describe("Random Generator Test", () => {
    let sutRandomGenerator: RandomGenerator;

    beforeAll(() => {
        sutRandomGenerator = new RandomGenerator();
    });

    it("RandomGenerator must be defined", () => expect(RandomGenerator).toBeDefined());

    it("RandomGenerator must have 3 private method and 2 public method", () => {
        // 이 부분은 왜 return 0 이 되는가?
        // expect(Object.keys(sutRandomGenerator).length).toBe(6);

        // public

        expect(sutRandomGenerator.getRandomPassword).toBeDefined();
        expect(typeof sutRandomGenerator.getRandomPassword).toBe("function");

        expect(sutRandomGenerator.getRandomVerifyCode).toBeDefined();
        expect(typeof sutRandomGenerator.getRandomVerifyCode).toBe("function");

        // private

        expect(sutRandomGenerator["getRandString"]).toBeDefined();
        expect(typeof sutRandomGenerator["getRandString"]).toBe("function");

        expect(sutRandomGenerator["getRandSpecialString"]).toBeDefined();
        expect(typeof sutRandomGenerator["getRandSpecialString"]).toBe("function");

        expect(sutRandomGenerator["combineWords"]).toBeDefined();
        expect(typeof sutRandomGenerator["combineWords"]).toBe("function");
    });

    describe("RandomGenerator.prototype.getRandString", () => {
        it("should return values less than 1 equlity of duplication per 10 excution : pass 0.1% (1/10)", () => {
            const maxExecutionCount = 10;

            const randStirngList = new Array<string>();
            const randStringSet = new Set<string>();

            for (let idx = 0; idx < maxExecutionCount; idx++) {
                const randString = sutRandomGenerator["getRandString"]();
                randStirngList.push(randString);
                randStringSet.add(randString);
            }

            const { lengthOfSet, lengthOfList } = {
                lengthOfSet: randStringSet.size,
                lengthOfList: randStirngList.length,
            };

            expect(lengthOfSet - lengthOfList).toBeLessThanOrEqual(1);
        });

        it("should return values less than 1 equlity of duplication per 100 excution : pass 0.01% (1/100)", () => {
            const maxExecutionCount = 100;

            const randStirngList = new Array<string>();
            const randStringSet = new Set<string>();

            for (let idx = 0; idx < maxExecutionCount; idx++) {
                const randString = sutRandomGenerator["getRandString"]();
                randStirngList.push(randString);
                randStringSet.add(randString);
            }

            const { lengthOfSet, lengthOfList } = {
                lengthOfSet: randStringSet.size,
                lengthOfList: randStirngList.length,
            };

            expect(lengthOfSet - lengthOfList).toBeLessThanOrEqual(1);
        });

        it("should return values less than 1 equlity of duplication per 1000 excution : pass 0.001% (1/1000)", () => {
            const maxExecutionCount = 1000;

            const randStirngList = new Array<string>();
            const randStringSet = new Set<string>();

            for (let idx = 0; idx < maxExecutionCount; idx++) {
                const randString = sutRandomGenerator["getRandString"]();
                randStirngList.push(randString);
                randStringSet.add(randString);
            }

            const { lengthOfSet, lengthOfList } = {
                lengthOfSet: randStringSet.size,
                lengthOfList: randStirngList.length,
            };

            expect(lengthOfSet - lengthOfList).toBeLessThanOrEqual(1);
        });
    });

    describe("RandomGenerator.prototype.getRandString", () => {
        it(`should return ["@", "!", "@", "@", "!"] per one cycle`, () => {
            const wordList = ["@", "!", "@", "@", "!"];

            expect(sutRandomGenerator["getRandSpecialString"](0)).toBe(wordList[0]);
            expect(sutRandomGenerator["getRandSpecialString"](1)).toBe(wordList[1]);
            expect(sutRandomGenerator["getRandSpecialString"](2)).toBe(wordList[2]);
            expect(sutRandomGenerator["getRandSpecialString"](3)).toBe(wordList[3]);
            expect(sutRandomGenerator["getRandSpecialString"](4)).toBe(wordList[4]);

            expect(sutRandomGenerator["getRandSpecialString"](5)).toBe(wordList[0]);
            expect(sutRandomGenerator["getRandSpecialString"](6)).toBe(wordList[1]);
            expect(sutRandomGenerator["getRandSpecialString"](7)).toBe(wordList[2]);
            expect(sutRandomGenerator["getRandSpecialString"](8)).toBe(wordList[3]);
            expect(sutRandomGenerator["getRandSpecialString"](9)).toBe(wordList[4]);
        });
    });

    describe("RandomGenerator.prototype.combineWords", () => {
        let targetWord: string, combinedWord: string;

        beforeAll(() => {
            targetWord = faker.word.noun();
            combinedWord = "@";
        });

        it("대상 word 의 첫 idx 에 값 넣기", () => {
            const result = sutRandomGenerator["combineWords"]({
                idx: 0,
                word: [...targetWord],
                specialStr: combinedWord,
            });

            expect(result).toBeDefined();
            expect(result.length).toBe(targetWord.length + 1);

            expect(result[0]).toBe(combinedWord);
        });

        it("대상 word 의 랜덤 idx 에 값 넣기", () => {
            const targetIdx = Math.floor(targetWord.length / 2);
            const result = sutRandomGenerator["combineWords"]({
                idx: targetIdx,
                word: [...targetWord],
                specialStr: combinedWord,
            });

            expect(result).toBeDefined();
            expect(result.length).toBe(targetWord.length + 1);

            expect(result[targetIdx]).toBe(combinedWord);
        });

        it("대상 word 의 마지막 idx 에 값 넣기", () => {
            const targetIdx = targetWord.length - 1;
            const result = sutRandomGenerator["combineWords"]({
                idx: targetIdx,
                word: [...targetWord],
                specialStr: combinedWord,
            });

            expect(result).toBeDefined();
            expect(result.length).toBe(targetWord.length + 1);

            expect(result[targetIdx]).toBe(combinedWord);
        });
    });
});
