/**
 * @deprecated
 */
export class DateProvider {
    /**
     * @deprecated
     */
    public getNowDatetime = (): string => {
        return new Date().toISOString().slice(0, 19).replace("T", " ");
    };
}
