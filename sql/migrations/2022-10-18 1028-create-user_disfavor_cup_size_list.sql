
-- Undo
DROP TABLE IF EXISTS user_disfavor_cup_size_list;


-- Do
CREATE TABLE IF NOT EXISTS user_disfavor_cup_size_list (
    user_id                 INT            NOT NULL,
    cup_size                VARCHAR(3)     NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (cup_size) REFERENCES recipe_cup_size (size)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);