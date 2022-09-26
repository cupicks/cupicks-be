import "dayjs/locale/ko";
import * as dayjs from "dayjs";

export type TDatabaseFormat = "YYYY-MM-DD hh:mm:ss";
export type TClientFormat = "YYYY년 MM월 DD일 hh:mm";

export type TProvidedFormat = TDatabaseFormat | TClientFormat;

export class DayjsProvider {
    /**
     * dayjs().format 에서 인스로 사용할 포멧입니다.
     * Database 에게 제공될 양식입니다.
     */
    public getDayabaseFormat(): TDatabaseFormat {
        return "YYYY-MM-DD hh:mm:ss";
    }

    /**
     * dayjs().format 에서 인스로 사용할 포멧입니다.
     * CLient 에게 제공될 양식입니다.
     */
    public getClientFormat(): TClientFormat {
        return "YYYY년 MM월 DD일 hh:mm";
    }

    /**
     * dayjs 의 Dayjs 인스턴스를 반환하는 메서드입니다.
     */
    public getDayjsInstance(): dayjs.Dayjs {
        return dayjs();
    }

    public changeToProvidedFormat(targetDayjs: dayjs.Dayjs | string, format: TProvidedFormat) {
        return dayjs(targetDayjs).format(format);
    }

    public getAddTime(
        targetDayjs: dayjs.Dayjs | string,
        addingOption: {
            limitCount: number;
            limitType: dayjs.ManipulateType;
        },
    ): dayjs.Dayjs {
        return dayjs(targetDayjs).add(addingOption.limitCount, addingOption.limitType);
    }

    /**
     *
     * `targetDay` 에서 `currentDay` 의 차이를 milliseconds 로 계산해 반환합니다.
     * 계산 상의 편의를 위해서 `targetDay` 에 일정 시간을 더하고 싶으면 `addingOption` 을 주면 됩니다.
     *
     * 반환값이 `음수` 라는 것은 `targetDay` + `addingDay` 가 지났음을 의미합니다.
     */
    public getDiffMIlliSeconds(
        targetDayjs: dayjs.Dayjs | string,
        currentDayjs: dayjs.Dayjs | string,
        addingOption: {
            limitCount: number;
            limitType: dayjs.ManipulateType;
        } | null,
    ): number {
        if (addingOption === null) return dayjs(targetDayjs).diff(currentDayjs);
        else return dayjs(targetDayjs).add(addingOption.limitCount, addingOption.limitType).diff(currentDayjs);
    }
}
