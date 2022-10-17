use cupick_dev;
SELECT * FROM recipe_category;

# Do
DELETE FROM
    recipe_category_list
WHERE
    category_name in (
        'milk',
        'caffein',
        'lemon',
        'syrup'
    );

DELETE FROM recipe_category
WHERE
    name in (
        'milk',
        'caffein',
        'lemon',
        'syrup'
    );

INSERT INTO
    recipe_category (name)
VALUES ('커피우유'), ('휘핑크림'), ('바닐라 시럽'), ('헤이즐넛 시럽'), ('카라멜 시럽'), ('초코 녹차'), ('홍차'), ('딸기'), ('청포도'), ('오렌지'), ('자몽'), ('레몬'), ('블루베리'), ('타피오카 펄'), ('탄산수'), ('민트'), ('시나몬');