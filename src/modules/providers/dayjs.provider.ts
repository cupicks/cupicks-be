import "dayjs/locale/ko";
import * as dayjs from "dayjs";

export class DayjsProvider {
    public getDatetime(): string {
        return dayjs().format("YYYY-MM-DD hh:mm:ss");
    }

    /**
     *
     * `targetDay` 에서 `currentDay` 의 차이를 milliseconds 로 계산해 반환합니다.
     * 계산 상의 편의를 위해서 `targetDay` 에 일정 시간을 더하고 싶으면 `addingOption` 을 주면 됩니다.
     *
     * 반환값이 `음수` 라는 것은 `targetDay` + `addingDay` 가 지났음을 의미합니다.
     */
    public getDiffMIlliSeconds(
        targetDayjs: string,
        currentDayjs: string,
        addingOption: {
            limitCount: number;
            limitType: dayjs.ManipulateType;
        } | null,
    ): number {
        if (addingOption === null) return dayjs(targetDayjs).diff(currentDayjs);
        else return dayjs(targetDayjs).add(addingOption.limitCount, addingOption.limitType).diff(currentDayjs);
    }
}
