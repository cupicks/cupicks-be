# 내 손안의 작은 카페, Cupick

![image](https://user-images.githubusercontent.com/86306802/193551464-d254e52a-dc45-46a0-a991-7d0475ce5b00.png)

> Cupick 은 **이미지만 보고 만드는 카페 레시피 제작 및 공유 서비스** 입니다. <br>
> 
> 프로젝트는 2022.08.26 ~ 2022.10.07 까지 총 **42 일** 간 진행되었습니다.<br>
> 종료 후, 2022.10.11 부터 **유저 테스트** 반영한 **추가 기능** 및 **리팩터링** 작업을 하고 있습니다.

### 버전 관리

| 버전 | 기간 |
| ------- | --- |
| v1.3.697 | 2022.08.26 ~ 2022.10.07 |

---

### 아키텍처

<image src="https://user-images.githubusercontent.com/86306802/193556455-15aa6cc8-58e5-4825-9740-4f338a51aa0f.png" />

### 관련 링크

- Figma / [디자인 시안](https://www.figma.com/file/H0DTlyM8k8HP1fqgrmKlwR/Cupick?node-id=868%3A1196)
- Notion / [브로슈어](https://www.notion.so/24545255734e48d487e3b55da356dc4e)
- Notion / [협업 문서](https://www.notion.so/73c1cc9c739a481fa92192ba7676811f)
- GitHub / [프론트엔드, React 저장소](https://github.com/cupicks/cupicks-fe)
- GitHub / [백엔드, Express 저장소](https://github.com/cupicks/cupicks-be)
- GitHub / [백엔드, Labmda 저장소](https://github.com/cupicks/cupicks-be-lambda)

### BE 팀원

| 포지션 | 이름 | number | email | Link |
| :---- | :---- | :---- | :---- | :---- |
| Backend, L | 이민석 | 010-9781-8756 | workstation19961002@gmail.com | [GitHub](https://github.com/unchaptered) |
| Backend | 윤승근 | 010-4991-7593 | axisotherwise@gmail.com | [GitHub](https://github.com/axisotherwise) |

### BE 역할

| 포지션 | 이름 | Role |
| :---- | :---- | :---- |
| Backend, L | 이민석 | 인증관련 API, 프로젝트 셋팅, 배포 및 테스트 자동화, 메일링(SES) |
| Backend | 윤승근 | 레시피 API, 댓글 API, [cupikcs/cupicks-be-lambda](https://github.com/cupicks/cupicks-be-lambda) |

### 문서 리스트

- [API 리스트 (v1.3.697) _ 0928](https://www.notion.so/API-_-0928-158b92d9cf6e4601b4c0b04c22513cbb)
- [API 명세서 (v1.3.697) _ 0928](https://www.notion.so/API-_-0928-ce1db36c2fa7491f8fec700be56cc45f)
- [API 리스트 (작업 중) _ 1008](https://www.notion.so/API-_-1008-5206e8bbb3bb474987354da04217271f)
- [API 명세서 (작업 중) _ 1008](https://www.notion.so/API-_-1008-ed3337a7bb874779a99bab61177790fc)

### [트러블 슈팅](https://github.com/cupicks/cupicks-be/wiki/1.-%ED%8A%B8%EB%9F%AC%EB%B8%94-%EC%8A%88%ED%8C%85)

- TypeScript _ReferenceError : Cannot Access_ with mysql2\/promise
- TypeScript 컴파일러 튜닝 및 변경을 통한 컴파일러 성능 약 **75%** 단축
- GitHub Action + Shell Script + CodeDeploy 를 이용한 **무중단 배포 자동화** 와 **좀비 프로세스 방지**
- GitHub Action + Jest 를 이용한 **테스트 자동화** 로 컴파일링 실패 감지
- GitHub Action 을 이용한 **Lambda 배포 자동화**
- Lambda, Sharp 를 이용한 이미지 압축

### [라이브러리 선택 이유](https://github.com/cupicks/cupicks-be/wiki/3.-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-%EC%84%A0%ED%83%9D)

1. JWT RS256 선택
2. TypeScript 선택 이유
3. MySQL 선택 이유
4. Raw Query 선택 이유
5. AWS Lambda 선택 이유
    <details>
        <summary>그 외의 Dependencies</summary>

    1. env : 환경변수 설정을 도와주는 라이브러리
    2. cors : CORS 설정을 손쉽게 도와주는 라이브러리
    3. joi : 형태와 범위 등의 유효성 검사를 위한 라이브러리
    4. bcrypt : 단방향 암호화를 위한 라이브러리
    5. jsonwebtoken : JWT 를 만들기 위한 라이브러리로 RS256 알고리즘 선택
    6. uuid : Bcrypt 
    7. dayjs : Date 포맷팅, 연산 처리를 위한 경량 라이브러리
    8. multer : multipart/form-data 파서를 포함하고 있는 이미지 처리용 미들웨어
    9. morgan : 간단한 요청 로그를 노출 시킬 수 있게 도와주는 미들웨어

    </details>
    <details>
        <summary>그 외의 devDependencies</summary>

    1. cross-env : NODE_ENV 주입을 위한 라이브러리
    2. husky, lint-staged, prettier : 개별 커밋에 prettier 자동 적용 (local hooks)
    3. jest, esbuld-jest : 테스트 코드 실행을 위한 라이브러리 및 컴파일러
    4. node-mocks-http : Mock Request, Response 라이브러리
    5. @faker-js/faker : Mock Data 라이브러리
    6. typescript, @types/* : TypeScript 컴파일러(tsc) 와 타입 파일

    </details>

<br>

### [공급자 클래스](https://github.com/cupicks/cupicks-be/wiki/5.-%EA%B3%B5%EA%B8%89%EC%9E%90-%ED%81%B4%EB%9E%98%EC%8A%A4)

1. EnvProvider + Env 으로 환경 변수 의 누락을 검출 하고 안정적인 공급을 구현
2. CustomException + ErrorHandler 으로 사용한 비즈니스 로직 간소화
3. DtoFactroy + JoiValidator + Dto 으로 도메인의 매개변수 간소화

### ERD

- [SQL Files](./sql/README.md)

<details>
    <summary>v1.3.697</summary>

<image src="./ERD.png">

</details>

---

### 라이브러리

Team

<img src="https://img.shields.io/badge/Husky-CB3837?style=flat-square&logo=npm&logoColor=white"/></a>
<img src="https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=Prettier&logoColor=white"/></a>
<img src="https://img.shields.io/badge/Lint_staged-CB3837?style=flat-square&logo=npm&logoColor=white"/></a>
<img src="https://img.shields.io/badge/GitHub_Action-2088FF?style=flat-square&logo=GitHub Actions&logoColor=white"/></a>

Dependencies

<img src="https://img.shields.io/badge/PM2-2B037A?style=flat-square&logo=PM2&logoColor=white"/></a>
<img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=Express&logoColor=white"/></a>
<img src="https://img.shields.io/badge/Jsonwebtoken-000000?style=flat-square&logo=JSON Web Tokens&logoColor=white"/></a>
<img src="https://img.shields.io/badge/Cors-CB3837?style=flat-square&logo=npm&logoColor=white"/></a>
<img src="https://img.shields.io/badge/Bcrypt-CB3837?style=flat-square&logo=npm&logoColor=white"/></a>
<img src="https://img.shields.io/badge/Dayjs-CB3837?style=flat-square&logo=npm&logoColor=white"/></a>
<img src="https://img.shields.io/badge/Joi-CB3837?style=flat-square&logo=npm&logoColor=white"/></a>
<img src="https://img.shields.io/badge/Multer-CB3837?style=flat-square&logo=npm&logoColor=white"/></a>
<img src="https://img.shields.io/badge/UUID-CB3837?style=flat-square&logo=npm&logoColor=white"/></a>
<img src="https://img.shields.io/badge/AWS_SDK-CB3837?style=flat-square&logo=npm&logoColor=white"/></a>

DevDependencies

<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white"/></a>
<img src="https://img.shields.io/badge/Bash-4EAA25?style=flat-square&logo=GNU Bash&logoColor=white"/></a>
<img src="https://img.shields.io/badge/Jest-CB3837?style=flat-square&logo=Jest&logoColor=white"/></a>
<img src="https://img.shields.io/badge/morgan-CB3837?style=flat-square&logo=npm&logoColor=white"/></a>
<img src="https://img.shields.io/badge/Node_Mock_Http-CB3837?style=flat-square&logo=npm&logoColor=white"/></a>
<img src="https://img.shields.io/badge/@faker_js-CB3837?style=flat-square&logo=npm&logoColor=white"/></a>
<img src="https://img.shields.io/badge/Esbuild_Jest-CB3837?style=flat-square&logo=npm&logoColor=white"/></a>

Infra

<img src="https://img.shields.io/badge/NGINX-009639?style=flat-square&logo=NGINX&logoColor=white"/></a>
<img src="https://img.shields.io/badge/NGINX_Amplify-009639?style=flat-square&logo=NGINX&logoColor=white"/></a>
<img src="https://img.shields.io/badge/Fail2Ban-000000?style=flat-square"/></a>
