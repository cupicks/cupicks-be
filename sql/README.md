[< Go Back](../README.md)

---

# SQL Files

Cupick 이 **42 일** 간 진행된 공식 프로젝트 기간이 종료 되었습니다.

기간 종료 이후에 다음과 같은 작업이 협의 및 예정되었습니다.

1. 추가 기능 논의
    1. 유저의 활동에 따라 뱃지 수여
    2. 유저의 선호 및 비선호 선택에 의한 알고리즘 도입
2. 리팩토링 및 테스트 코드 추가

이중 ***추가 기능 논의*** 단계에서 ***테이블 수정 및 기준값 변경*** 등이 필요했습니다.

기존의 [Cupick@1.3.697 이전](https://github.com/cupicks/cupicks-be/releases/tag/v1.3.697) 까지의 작업 방식은 실제 서비스 공급 이후에는 불가능했습니다.

또한, **ORM** 을 사용하지 않는 환경 에서의 Migration 을 위해서 직접 migration 을 위한 Do 및 Undo 구문을 추가하였습니다.

현재 진행 중인 migration 목록은 [v1.3.697 이후](./README.md#v13697-이후) 를 참고해주세요.

---

### v1.3.697 이전

서비스 변경시점 마다 `DROP TABLE` 과 `CREATE TABLE` 을 순차실행

- 장점 : 손쉬운 DB 초기화
- 단점 : 기입되어 있는 정보의 손실

---

### v1.4.0 이후

| Filename                               | Description     | Issue |
| -------------------------------------- | --------------- | ----- |
| 2022-10-17 1210 create recipe_cup_size | 참조용 레시피 사이즈 규격 | [#274](https://github.com/cupicks/cupicks-be/issues/274) |
| 2022-10-17 1217 update recipe_category | 참조용 레시피 재료 카테고리 | [#274](https://github.com/cupicks/cupicks-be/issues/274) |
| 2022-10-18 1010 create receip_temperature | 참조용 레시피 온도 규격 | [#274](https://github.com/cupicks/cupicks-be/issues/274) |
| 2022-10-18 1026 create user_favor_cup_size_list | 유저 선호 체계 | [#274](https://github.com/cupicks/cupicks-be/issues/274) |
| 2022-10-18 1028 create user_favor_cup_temperature_list | 유저 선호 체계 | [#274](https://github.com/cupicks/cupicks-be/issues/274) |
| 2022-10-18 1028 create user_disfavor_cup_size_list | 유저 비선호 체계 | [#274](https://github.com/cupicks/cupicks-be/issues/274) |
| 2022-10-18 1030 create user_disfavor_cup_temperature_list | 유저 비선호 체계 | [#274](https://github.com/cupicks/cupicks-be/issues/274) |
