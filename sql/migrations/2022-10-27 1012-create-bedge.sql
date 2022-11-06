-- Undo

DROP TABLE IF EXISTS bedge;

-- DO

CREATE TABLE IF NOT EXISTS bedge (
    order_num           INTEGER  UNIQUE,
    bedge_name          VARCHAR(10) NOT NULL UNIQUE,
    archivement_name    VARCHAR(50) NOT NULL,
    PRIMARY KEY (order_num, bedge_name, archivement_name)
);

INSERT INTO bedge (order_num, bedge_name, archivement_name) VALUES 
    (1, '레시피 첫 발자국', 'act_recipe_count'),
    (2, '댓글 첫 발자국', 'act_comment_count'),
    (3, '좋아요 첫 발자국', 'act_like_count'),
    (4, '레시피 연금술사', 'act_recipe_count'),
    (5, '능숙한 리스너', 'get_comment_count'),
    (6, '친화력 대장', 'act_comment_count'),
    (7, '인기쟁이 바리스타', 'get_like_count'),
    (8, '위클리 승리자', 'earn_weekly_recipe_award_count'),
    (9, '개근상', 'earn_weekly_full_attendance_award_count');