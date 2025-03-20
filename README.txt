Chạy mySQL

docker exec -it mysql_container bash
bash-5.1# mysql -u root -p

Các câu lệnh sequelize

npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli model:generate --name newsDetail --attributes product_id:integer,news_id:integer

Kiểm tra khóa ngoại của 1 bảng

SELECT * FROM information_schema.table_constraints
WHERE table_schema = 'shopapp_online' AND table_name = 'news_detail';