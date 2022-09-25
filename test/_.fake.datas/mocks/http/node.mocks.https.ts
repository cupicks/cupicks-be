import EventEmitter from "events";
import * as httpMock from "node-mocks-http";

/**
 * node-mocks-http 를 사용하여 mock Request 를 생성해 리턴합니다.
 */
function getMockRequest(body?: object) {
    const mockRequest = httpMock.createRequest({
        body,
    });

    return mockRequest;
}

/**
 * node-mocks-http 를 사용하여 mock Response 를 생성해 리턴합니다.
 *
 * 추가적으로 다음의 인자는 jest.fn() 으로 교체된 상태입니다.
 *
 * 1. response.json
 * 2. response.status
 * 3. response.redirect
 */
function getMockResponse() {
    const mockResponse = httpMock.createResponse({
        eventEmitter: EventEmitter,
    });

    mockResponse.status = jest.fn();
    mockResponse.json = jest.fn();
    mockResponse.redirect = jest.fn();

    return mockResponse;
}

export { getMockRequest, getMockResponse };
