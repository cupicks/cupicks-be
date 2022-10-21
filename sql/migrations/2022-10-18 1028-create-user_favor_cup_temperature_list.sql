
-- Undo

DROP TABLE IF EXISTS user_favor_temperature_list;

-- Do

CREATE TABLE IF NOT EXISTS user_favor_temperature_list (
    user_id                 INT            NOT NULL,
    state                   VARCHAR(3)     NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (state) REFERENCES recipe_temperature (state)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);