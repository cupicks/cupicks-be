-- Active: 1661246308902@@127.0.0.1@3306@cupick_dev

-- Undo

DROP TABLE IF EXISTS user_disfavor_temperature_list;

-- DO

CREATE TABLE IF NOT EXISTS user_disfavor_temperature_list (
    user_id                 INT            NOT NULL,
    state                   VARCHAR(3)     NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (state) REFERENCES recipe_temperature (state)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);