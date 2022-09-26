/**
 * References - https://dev.to/oyetoket/fastest-way-to-generate-random-strings-in-javascript-2k5a
 *
 */
export class RandomGenerator {
    /**
     * 랜덤한 문자와 숫자가 섞인 10 자리의 문자열을 반환합니다.
     */
    private getRandString(): string {
        return Math.random().toString(36).substring(2, 12);
    }

    /**
     * 특수문자 `!@#` 를 반환합니다.
     */
    private getRandSpecialString(idx: number): string {
        const pattern = ["@", "!", "@", "@", "!"];
        const specialStr = pattern[idx % pattern.length];

        return specialStr;
    }

    /**
     * 지정 인덱스 를 기준으로 word
     */
    private combineWords({ idx, word, specialStr }: { idx: number; word: string[]; specialStr: string }) {
        const left = word.slice(0, idx);
        const right = word.slice(idx, word.length);

        return [...left, specialStr, ...right].join("");
    }

    /**
     * 이 함수는 최소 2 개의 특수문자 `!@#` 를 포함하고 있는 12 개의 문자열 (숫자 + 영문) 을 반환합니다.
     */
    public getRandomPassword(accWord?: string, depth = 1): string {
        const idx = Math.floor(Math.random() * 10);

        if (accWord === undefined) {
            const word = [...this.getRandString()];
            const specialStr = this.getRandSpecialString(idx);
            return this.getRandomPassword(this.combineWords({ idx, word, specialStr }), ++depth);
        }

        const specialStr = this.getRandSpecialString(idx);

        return depth > 2
            ? accWord
            : this.getRandomPassword(this.combineWords({ idx, word: [...accWord], specialStr }), ++depth);
    }

    /**
     * 이 함수는 숫자로만 이루어진 길이 6 의 문자열을 반환합니다.
     */
    public getRandomVerifyCode(): string {
        let emailVerifyCode = "";

        for (let i = 0; i < 6; i++) {
            emailVerifyCode += Math.floor(Math.random() * 10);
        }

        return emailVerifyCode;
    }
}
