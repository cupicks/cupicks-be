-- Undo

DROP TABLE IF EXISTS archivement;

-- DO

CREATE TABLE IF NOT EXISTS archivement (
        archivement_name    VARCHAR(50)     NOT NULL    PRIMARY KEY
);

INSERT INTO
    archivement (archivement_name)
VALUES
    ('act_recipe_count'),
    ('act_comment_count'),
    ('act_like_count'),
    ('get_comment_count'),
    ('get_like_count'),
    ('earn_weekly_recipe_award_count'),
    ('earn_weekly_full_attendance_award_count');
