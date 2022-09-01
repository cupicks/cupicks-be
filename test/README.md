[< 뒤로가기](../README.md)

## 테스트 코드

Unit Test, Integration Test, E2E 테스틑 얼마만큼 `진짜에 가까운 테스트` 인가 입니다.

즉, Unit Test 에 가까울 수록 `가짜에 가까운 테스트` 이며 이는 분기점 테스트처럼 형태로 진행됩니다.

하지만, E2E 테스트에 가까울수록 `여러 객체의 협력` 을 실제로 검증하는 것에 가깝습니다.

더 자세한 내용은 _아래 게시글_ 혹은 _블라디미르 코리코프의 단위 테스트_ 를 참고해주세요.

- [테스트 코드에 대하여 - 이론편](https://www.notion.so/Test-35adbe5ccd1d42aeb754f193fc38b94e)

따라서 ~/test/_.fake.datas 에 있는 폴더 들은 각각의 테스트 유형에서 필요한 `가짜 모음` 이 들어갈 자리입니다.


저희가 테스트활 3 가지 경우는 각각 _다음의 폴더_ 와 _다음의 명령어_ 와 매칭 됩니다.

| 유형                  | 폴더 구조             | 단일 실행 스크립트 | 반복 실행 스크립트(감시) |
| :-------------------- | :-------------------- | :---------------- | :---------------------- |
| E2E 테스트            | ~/test/e2e            | npm run test:e2e  | npm run test:e2e:watch  |
| Integration 테스트    | ~/test/integration    | npm run test:int  | npm run test:int:watch  |
| Unit 테스트           | ~/test/unit           | npm run test:unit | npm run test:unit:watch |

실행 시 사용하고 있는 세부 옵션은 [Jest Docs - Configuring Jest](https://jestjs.io/docs/configuration) 를 참고해주세요.
