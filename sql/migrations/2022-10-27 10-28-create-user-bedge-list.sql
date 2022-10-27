-- Undo

DROP TABLE IF EXISTS user_bedge_list;

-- Do

CREATE TABLE IF NOT EXISTS user_bedge_list (
    user_id         INTEGER     NOT NULL,
    badge_name      VARCHAR(10) NOT NULL,
    created_at      DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (badge_name) REFERENCES bedge (bedge_name)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    PRIMARY KEY (user_id, badge_name)
);
