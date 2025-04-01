Chạy mySQL

docker exec -it mysql_container bash
bash-5.1# mysql -u root -p

Các câu lệnh sequelize

npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli model:generate --name CartItem --attributes cart_id:integer,product_id:integer,quantity:integer;

Kiểm tra khóa ngoại của 1 bảng
ALTER TABLE products 
MODIFY COLUMN oldprice INT DEFAULT 0,
ADD CONSTRAINT chk_oldprice CHECK (oldprice >= 0),
MODIFY COLUMN quantity INT DEFAULT 0,
ADD CONSTRAINT chk_quantity CHECK (quantity >= 0),
MODIFY COLUMN buyturn INT DEFAULT 0,
ADD CONSTRAINT chk_buyturn CHECK (buyturn >= 0);

SELECT * FROM information_schema.table_constraints
WHERE table_schema = 'shopapp_online' AND table_name = 'products';