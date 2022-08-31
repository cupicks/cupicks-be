import { SignupUserDto } from "../../models/_.loader";
import { PoolConnection } from "mysql2/promise";

export class AuthRepository {
    public isExistsByEmail = async (conn: PoolConnection, email: string): Promise<boolean> => {
        // 쿼리문 추가하면 끝

        return false;
    };

    public createUser = async (conn: PoolConnection, userDto: SignupUserDto): Promise<object | null> => {
        // 쿼리문 추가하면 끝

        if (userDto.email.length < 1) {
            return userDto;
        } else return null;
    };
    // 있는 지만 확인하는 것 : boolean = isExists
    // 찾는 것 : 해당 대상을 꺼내고 = find
    // 생성 = create
    // 수정 = update
    // 삭제 = delete

    // find모델
    // findUserByUserId
    // findUserByEmail
}
