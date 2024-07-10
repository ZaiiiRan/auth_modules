CREATE TABLE users (
    _id BIGSERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    "isActivated" BOOLEAN DEFAULT false,
    "activationLink" TEXT,
    "isBlocked" BOOLEAN DEFAULT false
);

CREATE TABLE roles (
    _id SERIAL PRIMARY KEY,
    value TEXT NOT NULL
);

CREATE TABLE roles_for_users (
    "userID" BIGINT NOT NULL REFERENCES users(_id),
    "roleID" INTEGER NOT NULL REFERENCES roles(_id)
);

CREATE TABLE tokens (
    _id BIGSERIAL PRIMARY KEY,
    "userID" BIGINT NOT NULL REFERENCES users(_id),
    "refreshToken" TEXT NOT NULL
);

CREATE TABLE posts (
	_id BIGSERIAL PRIMARY KEY,
	"user" BIGINT REFERENCES users(_id) NOT NULL,
	title TEXT NOT NULL,
	body TEXT NOT NULL,
	"date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	lastEditDate TIMESTAMP
);




INSERT INTO roles (value) VALUES ('USER'), ('ADMIN');