// https://medium.com/suyeonme/ts-enum-vs-union-type-in-performance-3971825ea65a

// AUTH PROFILE RECIPE COMMENT
const ERROR_CODE_LIST = {
    //AUTH
    "문제상황 묘사": "AUTH001",
    // PROFILE

    // RECIPE

    // COMMENT

    // DATABASE
    "알 수 없는 에러": "UNKOWN",
} as const;

export type TERROR_CODE = typeof ERROR_CODE_LIST[keyof typeof ERROR_CODE_LIST];
