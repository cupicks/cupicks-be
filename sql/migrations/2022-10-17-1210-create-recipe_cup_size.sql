use cupick_dev;

SELECT * FROM cupick_dev.recipe;

# Undo

ALTER TABLE recipe
DROP CONSTRAINT cup_size_constraint;

DROP TABLE IF EXISTS recipe_cup_size;

# Do

CREATE TABLE IF NOT EXISTS recipe_cup_size (
    size            VARCHAR(3) PRIMARY KEY
);

ALTER TABLE recipe
ADD CONSTRAINT cup_size_constraint FOREIGN KEY (cup_size) REFERENCES recipe_cup_size (size);