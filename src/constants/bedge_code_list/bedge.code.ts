export const BEDGE_CODE_LIST = {
    /**
     * act_recipe_count
     * 첫 번째 레시피 작성
     */
    "레시피 첫 발자국": "1ST__ACT_RECIPE",

    /**
     * act_comment_count
     * 첫 번째 댓글 작성
     */
    "댓글 첫 발자국": "1ST_ACT_COMMENT",

    /**
     * act_like_count
     * 첫 번째 좋아요 작성
     */
    "좋아요 첫 발자국": "1ST_ACT_LIKE",

    /**
     * act_recipe_count
     * 세 번째 레시피 작성
     */
    "레시피 연금술사": "3RD_ACT_RECIPE",

    /**
     * get_comment_count
     * 세 번째 댓글 받기
     */
    "능숙한 리스너": "3RD_GET_COMMENT",

    /**
     * act_comment_count
     * 세 번째 댓글 작성
     */
    "친화력 대장": "3RD_ACT_COMMENT",

    /**
     * get_like_count
     * 세 번째 좋아요 받기
     */
    "인기쟁이 바리스타": "3RD_GET_LIKE",

    /**
     * 첫 번째 주간 레시피 당첨
     * earn_weekly_recipe_award_count
     */
    "위클리 승리자": "1ST_EARN_WEEKLY_RECIPE",

    /**
     * 첫 번째 주간 출석 완성
     * earn_weekly_full_attendance_award_count
     */
    "개근상 A": "1ST_EARN_WEEKLY_FULL_ATTENDANCE",
} as const;

export type TBEDGE_CODE = typeof BEDGE_CODE_LIST[keyof typeof BEDGE_CODE_LIST];
