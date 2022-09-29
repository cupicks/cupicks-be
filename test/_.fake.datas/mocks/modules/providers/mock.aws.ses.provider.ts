export const MockAwsSesProvider = {
    getSesInstance: jest.fn(),
    getRandomSixDigitsVerifiedCode: jest.fn(),
    sendVerifyCode: jest.fn(),
    sendTempPassword: jest.fn(),
};
