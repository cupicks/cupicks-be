# cupick-be

커픽 Cupick은 계량 없이 이미지만 보고 만들 수 있는 
카페 레시피를 확인하고 공유하는 서비스입니다.

- Notion : [회의록 및 소개 페이지](https://www.notion.so/Cupick-3-73c1cc9c739a481fa92192ba7676811f)
- FE Repo : [Cupicks/cupicks-fe](https://github.com/cupicks/cupicks-fe)
- BE Repo : [Cupicks/cupicks-be](https://github.com/cupicks/cupicks-be)

## contributors

| 포지션 | 이름 | Contact | Link |
| :---- | :---- | :---- | :---- |
| Backend, L | 이민석 | workstation19961002@gmail.com | [GitHub](https://github.com/unchaptered) |
| Backend | 윤승근 | axisotherwise@gmail.com | [GitHub](https://github.com/axisotherwise) |

## ground-rule

- be 정기 회의 : 평일 10:00
- 코드 컨밴션 : prettier, eslint - [출처](https://github.com/unchaptered/express-ts-web-di/blob/main/package.json)
- 코드 컨밴션 자동 적용 : lint-staged, husky - [출처](https://velog.io/@lokijoji2/ESLint%EB%9E%91-Prettier-%EC%93%B0%EA%B8%B0-%EA%B7%80%EC%B0%AE%EC%9C%BC%EB%A9%B4-%EC%9D%B4%EA%B1%B0-%EC%8D%A8-cak7e4uo)

### TypeScript 도입 계기

Copick 의 팀 아이덴티티는 `안정적인 개발` 이었습니다.
팀 협의에서 기능의 수를 줄이더라도 생산성 및 유지보수성을 가져보자 라는 방향성이 있었습니다.

일회성 서버가 아니라, 지속적으로 관리할 수 있는 서버를 만들고 싶었습니다.
따라서, 기능의 수를 조금 줄이더라도 안정성 측면에서 TypeScript 는 꼭 필요한 도전이라고 생각했습니다.

1. TypeScript  를 도입 하는 데 들어가는 자원 에 비해서 정적 타입 언어로써 가지는 타입 안정성이 높다고 느꼈습니다.
2. 협업 할 때, JavaScript 에서는 무슨 자료형인지 알 수 없어서 불편했고 이를 해결할 수 있는 방법이라고 느꼈습니다.
3. 항해99 에 주특기 3 주차에 OOP 에 대한 것을 알게 되었고 이 부분을 더 공부하고 싶어서 다양한 추상화 기법이 존재하는 TypeScript 를 배우고 싶었습니다.
 