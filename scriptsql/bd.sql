use ingressosprovi;
show tables;
desc users;
desc events;
desc purchases;

select * from purchases;
select * from users;
select * from events;


UPDATE users
SET role = 'admin'
WHERE id = 1;

use ingressosprovi;
select * from users;

truncate table users;
truncate table purchases;
truncate table events;
DELETE FROM users;
DELETE FROM purchases;
DELETE FROM events;

ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE events AUTO_INCREMENT = 1;
ALTER TABLE purchases AUTO_INCREMENT = 1;

desc purchases;
desc events;
