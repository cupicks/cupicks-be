
USE sys;
DROP DATABASE IF EXISTS cupick_dev;
CREATE DATABASE IF NOT EXISTS cupick_dev;
USE cupick_dev;


-- 차차상위 user + recipe 엔티티 제거

DROP TABLE IF EXISTS user_recipe;
DROP TABLE IF EXISTS user_like_recipe;
DROP TABLE IF EXISTS user_favor_recipe;
DROP TABLE IF EXISTS user_disfavor_recipe;


-- 차상위 recipe 엔티티 제거
DROP TABLE IF EXISTS recipe_ingredient_list;
DROP TABLE IF EXISTS recipe_ingredient;


-- 차상위 comment 엔티티 제거
DROP TABLE IF EXISTS recipe_comment;

-- 차상위 user 엔티티 제거
DROP TABLE IF EXISTS user_refresh_token;
DROP TABLE IF EXISTS user_detail;

-- 최상위 엔티티 제거
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS recipe;



CREATE TABLE IF NOT EXISTS user (
    user_id     INT             NOT NULL    PRIMARY KEY AUTO_INCREMENT,
    email       VARCHAR(20)     NOT NULL    UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    nickname    VARCHAR(10)     NOT NULL,
    image_url   VARCHAR(255)    NULL
);

CREATE TABLE IF NOT EXISTS user_detail (
    user_id     INT             NOT NULL    PRIMARY KEY,
    created_at  DATETIME        NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_refresh_token (
    user_id         INT             NOT NULL    PRIMARY KEY,
    refresh_token   VARCHAR(1000)    NULL,
    FOREIGN KEY (user_id) REFERENCES user (user_id)
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
    created_at  DATETIME        NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recipe_ingredient_list (
    recipe_id               INT PRIMARY KEY,
    recipe_ingredient_list  VARCHAR(255),
    FOREIGN KEY (recipe_id) REFERENCES recipe (recipe_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recipe_ingredient (
    recipe_ingredient_id    INT         NOT NULL    PRIMARY KEY AUTO_INCREMENT,
    recipe_id               INT         NOT NULL,
    ingredient_name         VARCHAR(20) NOT NULL,
    ingredient_color        VARCHAR(7)  NOT NULL,
    ingredient_amount       VARCHAR(3)  NOT NULL,
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
    recipe_id            INT         NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipe (recipe_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_favor_recipe (
    user_id                 INT             NOT NULL    PRIMARY KEY,
    recipe_ingredient_list  VARCHAR(255)    NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_disfavor_recipe (
    user_id                 INT         NOT NULL    PRIMARY KEY,
    recipe_ingredient_list  VARCHAR(255)    NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


-- comment 관련

CREATE TABLE IF NOT EXISTS comment (
    comment_id  INT                 NOT NULL    PRIMARY KEY,
    comment     VARCHAR(150)        NOT NULL,
    image_url   VARCHAR(255)             NULL,
    created_at  DATETIME        NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recipe_comment (
    user_recipe_id      INT         NOT NULL    PRIMARY KEY AUTO_INCREMENT,
    user_id             INT         NOT NULL,
    recipe_id            INT         NOT NULL,
    comment_id          INT         NOT NULL,
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