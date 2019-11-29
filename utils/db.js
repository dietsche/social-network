var spicedPg = require("spiced-pg");

var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

exports.addUserData = function(first, last, email, password) {
    return db.query(
        "INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
        [first, last, email, password]
    );
};

exports.getHashedPassword = function(email) {
    return db.query(`SELECT password, id FROM users WHERE email = $1`, [email]);
};

exports.getUserData = function(id) {
    return db.query("SELECT * FROM users WHERE id = $1", [id]);
};

exports.addImage = function(imageUrl, userId) {
    return db.query(`UPDATE users SET image = $1 WHERE id = $2 RETURNING *`, [
        imageUrl,
        userId
    ]);
};

exports.updateBio = function(bioText, userId) {
    return db.query(`UPDATE users SET bio = $1 WHERE id = $2 RETURNING bio`, [
        bioText,
        userId
    ]);
};
