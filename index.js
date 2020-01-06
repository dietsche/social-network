const express = require("express");
const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

const compression = require("compression");
const cookieSession = require("cookie-session");
const db = require("./utils/db");
const { hash, compare } = require("./utils/bc");
const csurf = require("csurf");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const s3 = require("./s3");
const { s3Url } = require("./config.json");
let onlineUsers = [];

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 5000000
    }
});

app.use(compression());
app.use(express.json());
app.use(express.static("./public"));

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/registration", async (req, res) => {
    const { first, last, email, password } = req.body;
    try {
        let hashedPassword = await hash(password);
        let result = await db.addUserData(first, last, email, hashedPassword);
        req.session.userId = result.rows[0].id;
        res.json({
            success: true
        });
    } catch (error) {
        res.json({
            success: false
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        let savedPassword = await db.getHashedPassword(req.body["email"]);
        let userId = savedPassword.rows[0].id;
        let compareResult = await compare(
            req.body["password"],
            savedPassword.rows[0].password
        );
        if (compareResult == true) {
            req.session.userId = userId;
            res.json({
                success: true
            });
        } else if (compareResult == false) {
            res.json({
                success: false
            });
        }
    } catch (error) {
        res.json({
            success: false
        });
    }
});

app.get("/api/user", async (req, res) => {
    try {
        let userId = req.session.userId;
        let userData = await db.getUserData(userId);
        let { first, last, image, bio } = userData.rows[0];
        res.json({
            success: true,
            first: first,
            last: last,
            image: image,
            bio: bio
        });
    } catch (error) {
        res.json({
            success: false
        });
    }
});

app.get("/api/otheruser/:id", async (req, res) => {
    try {
        let userId = req.session.userId;
        let otherId = req.params.id;
        if (userId != otherId) {
            let otherUserData = await db.getUserData(otherId);
            let { first, last, image, bio } = otherUserData.rows[0];
            res.json({
                success: true,
                first: first,
                last: last,
                image: image,
                bio: bio
            });
        } else {
            res.json({
                success: false
            });
        }
    } catch (error) {
        res.json({
            success: false
        });
    }
});

app.get("/api/findlatestusers", async (req, res) => {
    try {
        let latestUsers = await db.getLatestUsers();
        res.json({
            success: true,
            latestUsers: latestUsers.rows
        });
    } catch (error) {
        res.json({
            success: false
        });
    }
});

app.get("/api/searchusers/:str", async (req, res) => {
    let str = req.params.str;
    try {
        let resultUsers = await db.searchUsers(str);
        res.json({
            success: true,
            searchResult: resultUsers.rows
        });
    } catch (error) {
        res.json({
            success: false
        });
    }
});

app.get("/friendshipstatus/:otherId", async (req, res) => {
    let otherId = req.params.otherId;
    let ownId = req.session.userId;
    try {
        let resultFriendship = await db.getFriendshipStatus(otherId, ownId);
        res.json({
            resultFriendship: resultFriendship.rows,
            ownId: ownId,
            success: true
        });
    } catch (error) {
        res.json({ success: false });
    }
});

app.post("/api/send-friend-request/:otherId", async (req, res) => {
    let otherId = req.params.otherId;
    let ownId = req.session.userId;
    try {
        let sendFriendRequest = await db.sendFriendRequest(otherId, ownId);
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false });
    }
});

app.post("/api/accept-friend-request/:otherId", async (req, res) => {
    let otherId = req.params.otherId;
    let ownId = req.session.userId;
    try {
        let acceptFriendRequest = await db.acceptFriendRequest(otherId, ownId);
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false });
    }
});

app.post("/api/end-friendship/:otherId", async (req, res) => {
    let otherId = req.params.otherId;
    let ownId = req.session.userId;
    try {
        let endFriendship = await db.endFriendship(otherId, ownId);
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false });
    }
});

app.post("/uploadImage", uploader.single("file"), s3.upload, (req, res) => {
    const imageUrl = `${s3Url}/${req.file.filename}`;
    let userId = req.session.userId;
    db.addImage(imageUrl, userId)
        .then(result => {
            res.json({
                success: true,
                image: result.rows[0].image
            });
        })
        .catch(() => {
            res.json({
                success: false
            });
        });
});

app.post("/updateBio", async (req, res) => {
    let userId = req.session.userId;
    let bio = req.body.bio;
    try {
        let bioData = await db.updateBio(bio, userId);
        res.json({
            success: true,
            bio: bioData.rows[0].bio
        });
    } catch (error) {
        res.json({
            success: false
        });
    }
});

app.get("/api/friends-wannabees", async (req, res) => {
    let ownId = req.session.userId;

    try {
        let friendsAndWannabees = await db.getFriendsAndWannabees(ownId);
        res.json({
            friendsAndWannabees: friendsAndWannabees.rows,
            success: true
        });
    } catch (error) {
        res.json({ success: false });
    }
});

app.get("/logout", function(req, res) {
    req.session = null;
    res.redirect("/welcome");
});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function() {
    console.log("server listening.");
});

io.on("connection", function(socket) {
    console.log(`socket with the id ${socket.id} is now connected`);
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    let userId = socket.request.session.userId;
    db.getUserData(userId).then(data => {
        let { first, last, image, id } = data.rows[0];
        let newOnlineUser = {
            socketid: socket.id,
            first: first,
            last: last,
            image: image,
            id: id
        };

        let checkIfNew = true;
        onlineUsers.map(item => {
            if (item.id === newOnlineUser.id) {
                checkIfNew = false;
            }
        });

        if (checkIfNew !== false) {
            onlineUsers.push(newOnlineUser);
        }
        io.sockets.emit("usersOnlineList", onlineUsers);
    });

    db.getLastTenChatMessages()
        .then(data => {
            io.sockets.emit("chatMessages", data.rows.reverse());
        })
        .catch(err => {
            console.log(err);
        });

    socket.on("newChatMessage", msg => {
        userId = socket.request.session.userId;

        db.addNewMessage(msg, userId)
            .then(data => {
                let messageId = data.rows[0].message_id;
                db.getLatestChatMessage(messageId).then(data => {
                    io.sockets.emit("additionalMessage", data.rows[0]);
                });
            })

            .catch(err => {
                console.log(err);
            });
    });
    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter(function(obj) {
            return obj.socketid !== socket.id;
        });
    });
});
