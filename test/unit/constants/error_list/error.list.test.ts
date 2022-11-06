import { ERROR_CODE_LIST } from "../../../../src/constants/error_code_list/error.code";

describe("ERROR_CODE_LIST", () => {
    it("ERROR_CODE_LIST must be defined", () => expect(ERROR_CODE_LIST).toBeDefined());
    it("ERROR_CODE_LIST contain 18 cases (properties)", () => expect(Object.keys(ERROR_CODE_LIST).length).toBe(30));

    describe("ERROR_CODE_LIST's specific cases", () => {
        it("Object.keys(ERROR_CODE_LIST)", () => {
            //AUTH

            expect(ERROR_CODE_LIST["이미 사용 중인 이메일"]).toBeDefined();
            expect(ERROR_CODE_LIST["이미 사용 중인 닉네임"]).toBeDefined();
            expect(ERROR_CODE_LIST["존재하지 않는 이메일"]).toBeDefined();
            expect(ERROR_CODE_LIST["일치하지 않는 비밀번호"]).toBeDefined();

            expect(ERROR_CODE_LIST["인증절차를 진행하지 않은 사용자"]).toBeDefined();

            expect(ERROR_CODE_LIST["인증절차 - 인증번호 발송 을 진행하지 않은 사용자"]).toBeDefined();
            expect(ERROR_CODE_LIST["인증절차 - 잘못된 인증번호를 제출한 사용자"]).toBeDefined();
            expect(ERROR_CODE_LIST["인증절차 - 이미 다른 사람이 인증 중인 닉네임"]).toBeDefined();
            expect(ERROR_CODE_LIST["인증번호 - 인증번호 확인 을 진행하지 않은 사용자"]).toBeDefined();
            expect(ERROR_CODE_LIST["인증절차 - 이메일 인증번호 발급 사용제한"]).toBeDefined();
            expect(ERROR_CODE_LIST["인증절차 - 임시 비밀번호 발급 사용제한"]).toBeDefined();
            expect(ERROR_CODE_LIST["등록 되지 않은 EmailVerifyToken"]).toBeDefined();
            expect(ERROR_CODE_LIST["등록 되지 않은 NicnameVerifyToken"]).toBeDefined();
            expect(ERROR_CODE_LIST["이미 탈퇴한 사용자의 AccessToken"]).toBeDefined();
            expect(ERROR_CODE_LIST["이미 탈퇴한 사용자의 RefreshToken"]).toBeDefined();
            expect(ERROR_CODE_LIST["등록되지 않은 RefreshToken"]).toBeDefined();

            // PROFILE

            expect(ERROR_CODE_LIST["프로필 수정을 위한 모든 매개변수 누락"]).toBeDefined();

            // RECIPE

            expect(ERROR_CODE_LIST["존재하지 않는 레시피"]).toBeDefined();
            expect(ERROR_CODE_LIST["인증절차 - 내가 작성한 레시피에 대한 인증 실패"]).toBeDefined();
            expect(ERROR_CODE_LIST["좋아요 - 이미 좋아요 한 레시피"]).toBeDefined();
            expect(ERROR_CODE_LIST["좋아요 - 좋아요 하지 않은 레시피"]).toBeDefined();

            // COMMENT
            expect(ERROR_CODE_LIST["존재하지 않는 코멘트"]).toBeDefined();
            expect(ERROR_CODE_LIST["내가 작성한 코멘트에 대한 인증 실패"]).toBeDefined();

            // JWT
            expect(ERROR_CODE_LIST["요청자의 JWT 토큰 만료 혹은 검증 실패"]).toBeDefined();

            // VALIDATION

            expect(ERROR_CODE_LIST["요청값의 유효성 검사 실패"]).toBeDefined();

            // DATABASE

            expect(ERROR_CODE_LIST["데이터 베이스 연결 실패"]).toBeDefined();
            expect(ERROR_CODE_LIST["부적절한 쿼리문의 실행"]).toBeDefined();

            // BCRYPT

            expect(ERROR_CODE_LIST["암호화 에러"]).toBeDefined();

            // MULTER

            expect(ERROR_CODE_LIST["지원하지 않는 이미지 형식"]).toBeDefined();
            expect(ERROR_CODE_LIST["알 수 없는 에러"]).toBeDefined();
        });

        it("Object.values(ERROR_CODE_LIST)", () => {
            //AUTH

            expect(ERROR_CODE_LIST["이미 사용 중인 이메일"]).toBe("AUTH-001-01");
            expect(ERROR_CODE_LIST["이미 사용 중인 닉네임"]).toBe("AUTH-001-02");
            expect(ERROR_CODE_LIST["존재하지 않는 이메일"]).toBe("AUTH-002");
            expect(ERROR_CODE_LIST["일치하지 않는 비밀번호"]).toBe("AUTH-003");

            expect(ERROR_CODE_LIST["인증절차를 진행하지 않은 사용자"]).toBe("AUTH-004");

            expect(ERROR_CODE_LIST["인증절차 - 인증번호 발송 을 진행하지 않은 사용자"]).toBe("AUTH-004-01");
            expect(ERROR_CODE_LIST["인증절차 - 잘못된 인증번호를 제출한 사용자"]).toBe("AUTH-004-02");
            expect(ERROR_CODE_LIST["인증절차 - 이미 다른 사람이 인증 중인 닉네임"]).toBe("AUTH-004-03");
            expect(ERROR_CODE_LIST["인증번호 - 인증번호 확인 을 진행하지 않은 사용자"]).toBe("AUTH-004-04");
            expect(ERROR_CODE_LIST["인증절차 - 이메일 인증번호 발급 사용제한"]).toBe("AUTH-004-EXP-01");
            expect(ERROR_CODE_LIST["인증절차 - 임시 비밀번호 발급 사용제한"]).toBe("AUTH-004-EXP-02");
            expect(ERROR_CODE_LIST["등록 되지 않은 EmailVerifyToken"]).toBe("AUTH-005");
            expect(ERROR_CODE_LIST["등록 되지 않은 NicnameVerifyToken"]).toBe("AUTH-006");
            expect(ERROR_CODE_LIST["이미 탈퇴한 사용자의 AccessToken"]).toBe("AUTH-007-01");
            expect(ERROR_CODE_LIST["이미 탈퇴한 사용자의 RefreshToken"]).toBe("AUTH-007-02");
            expect(ERROR_CODE_LIST["등록되지 않은 RefreshToken"]).toBe("AUTH-008"); // 로그인 기록이 없는 사용);

            // PROFILE

            expect(ERROR_CODE_LIST["프로필 수정을 위한 모든 매개변수 누락"]).toBe("PROFILE-001");

            // RECIPE

            expect(ERROR_CODE_LIST["존재하지 않는 레시피"]).toBe("RECIPE-001");
            expect(ERROR_CODE_LIST["인증절차 - 내가 작성한 레시피에 대한 인증 실패"]).toBe("RECIPE-002");
            expect(ERROR_CODE_LIST["좋아요 - 이미 좋아요 한 레시피"]).toBe("RECIPE-003-01");
            expect(ERROR_CODE_LIST["좋아요 - 좋아요 하지 않은 레시피"]).toBe("RECIPE-003-02");

            // COMMENT
            expect(ERROR_CODE_LIST["존재하지 않는 코멘트"]).toBe("COMMENT-001");
            expect(ERROR_CODE_LIST["내가 작성한 코멘트에 대한 인증 실패"]).toBe("COMMENT-002");

            // JWT
            expect(ERROR_CODE_LIST["요청자의 JWT 토큰 만료 혹은 검증 실패"]).toBe("REQUEST_JWT_FAIL");

            // VALIDATION

            expect(ERROR_CODE_LIST["요청값의 유효성 검사 실패"]).toBe("REQUEST_VALIDATION_FAIL");

            // DATABASE

            expect(ERROR_CODE_LIST["데이터 베이스 연결 실패"]).toBe("DATABASE_CONNECTION_FAIL");
            expect(ERROR_CODE_LIST["부적절한 쿼리문의 실행"]).toBe("DATABASE_UNKOWN_QUERY");

            // BCRYPT

            expect(ERROR_CODE_LIST["암호화 에러"]).toBe("BCRYPT_HASH_COMPARE_FAIL");

            // MULTER

            expect(ERROR_CODE_LIST["지원하지 않는 이미지 형식"]).toBe("FILE EXTENSION ERROR");
            expect(ERROR_CODE_LIST["알 수 없는 에러"]).toBe("UNKOWN");
        });
    });
});
