create table userinfo(
	username char(150) not null,
	password char(50) not null,
	token char(15) not null,
	primary key (username)
) engine = INNODB DEFAULT character SET = utf8 COLLATE = utf8_general_ci;

create table event(
	id mediumint unsigned not null auto_increment,
	username char(150) not null,
	event char(255) not null,
	time char(15) not null,
	year smallint unsigned not null,
	month tinyint unsigned not null,
	day tinyint unsigned not null,
	class char(1) not null,
	primary key(id),
	foreign key (username) references userinfo (username)
) engine = INNODB DEFAULT character SET = utf8 COLLATE = utf8_general_ci;

create table share(
	id mediumint unsigned not null auto_increment,
	username char(150) not null,
	friendName char(150) not null, 
	event char(255) not null,
	time char(15) not null,
	year smallint unsigned not null,
	month tinyint unsigned not null,
	day tinyint unsigned not null,
	primary key(id),
	foreign key (username) references userinfo (username)
) engine = INNODB DEFAULT character SET = utf8 COLLATE = utf8_general_ci;

create table groupEvent(
	id mediumint unsigned not null auto_increment,
	memberOne char(150) not null,
	memberTwo char(150) not null,
	memberThree char(150) not null,
	event char(255) not null,
	time char(15) not null,
	year smallint unsigned not null,
	month tinyint unsigned not null,
	day tinyint unsigned not null,
	primary key (id)
) engine = INNODB DEFAULT character SET = utf8 COLLATE = utf8_general_ci;