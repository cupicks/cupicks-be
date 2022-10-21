
-- Undo

DROP TABLE IF EXISTS recipe_temperature;


-- Do
CREATE TABLE IF NOT EXISTS recipe_temperature (
    state           VARCHAR(3) PRIMARY KEY
);

INSERT INTO recipe_temperature (state) VALUES ('ice'), ('hot');