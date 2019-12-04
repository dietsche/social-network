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

exports.getLatestUsers = function() {
    return db.query(
        `SELECT first, last, id, bio, image FROM users ORDER BY id DESC LIMIT 3`
    );
};

exports.searchUsers = function(str) {
    return db.query(
        `SELECT first, last, id, bio, image FROM users WHERE first ILIKE $1 OR last ILIKE $1 LIMIT 20`,
        [str + "%"]
    );
};

exports.getFriendshipStatus = function(otherId, ownId) {
    return db.query(
        `SELECT * FROM friendships WHERE (receiver_id = $1 AND sender_id = $2) OR (receiver_id = $2 AND sender_id = $1)`,
        [otherId, ownId]
    );
};

exports.sendFriendRequest = function(otherId, ownId) {
    return db.query(
        `INSERT INTO friendships (receiver_id, sender_id) VALUES ($1, $2) RETURNING *`,
        [otherId, ownId]
    );
};

exports.acceptFriendRequest = function(otherId, ownId) {
    return db.query(
        `UPDATE friendships SET accepted = true WHERE (receiver_id = $2 AND sender_id = $1) RETURNING *`,
        [otherId, ownId]
    );
};

exports.endFriendship = function(otherId, ownId) {
    return db.query(
        `DELETE FROM friendships WHERE (receiver_id = $1 AND sender_id = $2) OR (receiver_id = $2 AND sender_id = $1) RETURNING *`,
        [otherId, ownId]
    );
};
