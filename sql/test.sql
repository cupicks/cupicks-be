
USE sys;
DROP DATABASE IF EXISTS cupick_test;
CREATE DATABASE IF NOT EXISTS cupick_test;
USE cupick_test;

-- 차차차상위 비정휴과 ranking 페이지 제거

DROP TABLE IF EXISTS best_recipe_ranking;
DROP TABLE IF EXISTS ranking_category;

-- 차차상위 user + recipe 엔티티 제거

DROP TABLE IF EXISTS user_recipe;
DROP TABLE IF EXISTS user_like_recipe;
DROP TABLE IF EXISTS user_favor_category_list;
DROP TABLE IF EXISTS user_disfavor_category_list;


-- 차상위 recipe 엔티티 제거
DROP TABLE IF EXISTS recipe_ingredient_list;
DROP TABLE IF EXISTS recipe_ingredient;
DROP TABLE IF EXISTS recipe_category_list;


-- 차상위 comment 엔티티 제거
DROP TABLE IF EXISTS recipe_comment;

-- 차상위 user 엔티티 제거
DROP TABLE IF EXISTS user_refresh_token;
DROP TABLE IF EXISTS user_detail;

-- 최상위 엔티티 제거
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS recipe;

DROP TABLE IF EXISTS user_verify_list;
DROP TABLE IF EXISTS recipe_category;

CREATE TABLE IF NOT EXISTS recipe_category (
    name            VARCHAR(20) PRIMARY KEY
);


INSERT INTO recipe_category (name) VALUES ('milk'), ('caffein'), ('lemon'), ('syrup');

CREATE TABLE IF NOT EXISTS user_verify_list (
    user_verify_list_id         INT              NOT NULL    PRIMARY KEY AUTO_INCREMENT,
    email                       VARCHAR(100)     NOT NULL    UNIQUE,
    email_verified_date         DATETIME         NULL,
    email_verified_token        VARCHAR(1000)    NULL,
    email_verified_code         VARCHAR(6)       NULL,
    is_verified_email           BOOLEAN          DEFAULT 0,
    current_email_sent_count    INT              NULL       DEFAULT 0 CHECK (current_email_sent_count <= 5), -- 1 일일 당 5 회만 가능
    email_sent_exceeding_date   DATETIME         NULL, -- 오버 플로우 시, 1일 간 사용 불가
    is_exeeded_of_email_sent    BOOLEAN          DEFAULT 0,
    nickname                    VARCHAR(20)      NULL,
    nickname_verified_date      DATETIME         NULL,
    nickname_verified_token     VARCHAR(1000)    NULL,
    is_verified_nickname        BOOLEAN          DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user (
    user_id                                 INT             NOT NULL    PRIMARY KEY AUTO_INCREMENT,
    user_verify_list_id                     INT             NOT NULL,
    email                                   VARCHAR(100)    NOT NULL    UNIQUE,
    nickname                                VARCHAR(10)     NOT NULL    UNIQUE,
    password                                VARCHAR(255)    NOT NULL,
    image_url                               VARCHAR(255)    NULL,
    resized_url                             VARCHAR(255)    NULL,
    refresh_token                           VARCHAR(1000)   NULL,
    created_at                              DATETIME        NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    updated_at                              DATETIME        NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    reset_password_token                    VARCHAR(1000)   NULL,
    reset_password_date                     DATETIME        NULL,
    current_password_sent_count             INT             NULL        DEFAULT 0 CHECK (current_password_sent_count <= 5), -- 1 일일 당 5회만 가능
    password_sent_exceeding_date            DATETIME        NULL, -- 오버 플로우 시, 1일 간 사용 불가
    is_exeeded_of_password_sent             BOOLEAN         DEFAULT 0,
    FOREIGN KEY (user_verify_list_id) REFERENCES user_verify_list (user_verify_list_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recipe (
    recipe_id   INT                 NOT NULL    PRIMARY KEY AUTO_INCREMENT,
    cup_size    VARCHAR(3)          NOT NULL,
    title       VARCHAR(20)         NOT NULL,
    content     VARCHAR(255)        NOT NULL,
    is_iced     BOOLEAN             NOT NULL,
    is_public   BOOLEAN             NOT NULL,
    created_at  DATETIME            NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME            NOT NULL    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recipe_category_list (
    recipe_category_id      INT             NOT NULL    PRIMARY KEY AUTO_INCREMENT,
    recipe_id               INT             NOT NULL,
    category_name           VARCHAR(20)     NOT NULL,
    FOREIGN KEY (category_name) REFERENCES recipe_category (name)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipe (recipe_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recipe_ingredient_list (
    recipe_id               INT             PRIMARY KEY,
    recipe_ingredient_list  VARCHAR(255),
    FOREIGN KEY (recipe_id) REFERENCES recipe (recipe_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recipe_ingredient (
    recipe_ingredient_id    INT             NOT NULL    PRIMARY KEY AUTO_INCREMENT,
    recipe_id               INT             NOT NULL,
    ingredient_name         VARCHAR(20)     NOT NULL,
    ingredient_color        VARCHAR(7)      NOT NULL,
    ingredient_amount       VARCHAR(3)      NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipe (recipe_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


-- user + recipe 관련

CREATE TABLE IF NOT EXISTS user_recipe (
    user_recipe_id      INT         NOT NULL    PRIMARY KEY AUTO_INCREMENT,
    user_id             INT         NOT NULL,
    recipe_id            INT         NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipe (recipe_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS user_like_recipe (
    user_like_recipe_id INT         NOT NULL    PRIMARY KEY AUTO_INCREMENT,
    user_id             INT         NOT NULL,
    recipe_id           INT         NOT NULL,
    created_at          DATETIME    NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipe (recipe_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_favor_category_list (
    user_id                 INT            NOT NULL,
    category_name           VARCHAR(20)    NOT NULL,
    PRIMARY KEY (user_id, category_name),
    FOREIGN KEY (user_id) REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (category_name) REFERENCES recipe_category (name)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_disfavor_category_list (
    user_id                 INT            NOT NULL,
    category_name           VARCHAR(20)    NOT NULL,
    PRIMARY KEY (user_id, category_name),
    FOREIGN KEY (user_id) REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (category_name) REFERENCES recipe_category (name)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


-- comment 관련

CREATE TABLE IF NOT EXISTS comment (
    comment_id  INT             NOT NULL    PRIMARY KEY AUTO_INCREMENT,
    comment     VARCHAR(150)    NOT NULL,
    image_url   VARCHAR(255)    NULL,
    resized_url VARCHAR(255)    NULL,
    created_at  DATETIME        NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recipe_comment (
    recipe_comment_id       INT         NOT NULL    PRIMARY KEY AUTO_INCREMENT,
    user_id                 INT         NOT NULL,
    recipe_id               INT         NOT NULL,
    comment_id              INT         NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipe (recipe_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comment (comment_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
-- best_recipe_ranking

CREATE TABLE IF NOT EXISTS ranking_category (
    name                VARCHAR(20)     NOT NULL PRIMARY KEY
);
INSERT INTO ranking_category (name) VALUES ('weekly'), ('monthly');

CREATE TABLE IF NOT EXISTS best_recipe_ranking (
    ranking             INT             NOT NULL    CHECK (ranking >=3 AND ranking > 1),
    recipe_id           INT             NOT NULL,
    start_date          DATETIME        NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    end_date            DATETIME        NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    category            VARCHAR(20)     NOT NULL,
    PRIMARY KEY (ranking, start_date, end_date),
    FOREIGN KEY (category) REFERENCES ranking_category (name)
);