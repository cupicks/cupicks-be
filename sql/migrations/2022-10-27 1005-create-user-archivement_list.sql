-- Undo

DROP TABLE IF EXISTS user_archivement_list;

-- DO

CREATE TABLE IF NOT EXISTS user_archivement_list (
    user_id             INT         NOT NULL,
    archivement_name    VARCHAR(50) NOT NULL,
    archivement_count   INTEGER     NOT NULL DEFAULT 0 CHECK (archivement_count >= 0),
    archivement_date    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (archivement_name) REFERENCES archivement (archivement_name)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    PRIMARY KEY (user_id, archivement_name)
);