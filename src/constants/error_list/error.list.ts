// https://medium.com/suyeonme/ts-enum-vs-union-type-in-performance-3971825ea65a

// AUTH PROFILE RECIPE COMMENT
const ERROR_CODE_LIST = {
    //AUTH
    "이미 사용 중인 이메일": "AUTH-001-01",
    "이미 사용 중인 닉네임": "AUTH-001-02",
    "존재하지 않는 이메일": "AUTH-002",
    "일치하지 않는 비밀번호": "AUTH-003",
    "인증절차를 진행하지 않은 사용자": "AUTH-004",
    "인증절차 - 인증번호 발송 을 진행하지 않은 사용자": "AUTH-004-01",
    "인증절차 - 잘못된 인증번호를 제출한 사용자": "AUTH-004-02",
    "등록 되지 않은 EmailVerifyToken": "AUTH-005",
    "등록 되지 않은 NicnameVerifyToken": "AUTH-006",
    "이미 탈퇴한 사용자의 AccesshToken": "AUTH-007-01",
    "이미 탈퇴한 사용자의 RefreshToken": "AUTH-007-02",
    "등록되지 않은 RefreshToken": "AUTH-008", // 로그인 기록이 없는 사용자

    // PROFILE

    "프로필 수정을 위한 모든 매개변수 누락": "PROFILE-001",

    // RECIPE
    "존재하지 않는 레시피": "RECIPE-001",
    "인증절차 - 내가 작성한 레시피에 대한 인증 실패": "RECIPE-002",
    "좋아요 - 이미 좋아요 한 레시피": "RECIPE-003-01",
    "좋아요 - 좋아요 하지 않은 레시피": "RECIPE-003-02",

    // COMMENT
    "존재하지 않는 코멘트": "COMMENT-001",
    "인증절차 - 내가 작성한 코멘트에 대한 인증 실패": "COMMENT-002",

    // JWT
    "요청자의 JWT 토큰 만료 혹은 검증 실패": "REQUEST_JWT_FAIL",

    // VALIDATION
    "요청값의 유효성 검사 실패": "REQUEST_VALIDATION_FAIL",

    // DATABASE
    "데이터 베이스 연결 실패": "DATABASE_CONNECTION_FAIL",
    "부적절한 쿼리문의 실행": "DATABASE_UNKOWN_QUERY",
    "알 수 없는 에러": "UNKOWN",

    // BCRYPT
    "암호화 에러": "BCRYPT_HASH_COMPARE_FAIL",

    // MULTER
    "지원하지 않는 이미지 형식": "FILE EXTENSION ERROR",
} as const;

export type TERROR_CODE = typeof ERROR_CODE_LIST[keyof typeof ERROR_CODE_LIST];
