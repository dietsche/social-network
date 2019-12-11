const express = require("express");
const app = express();

const server = require("http").Server(app); //app is given to secondary server; for requests that are not normal http
const io = require("socket.io")(server, { origins: "localhost:8080" }); //for deploying add (seperated by spaces): "mysocialapp.herokuapp.com:*"

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
        fileSize: 5000000 //2 MB limit!
    }
});

//add bodyParsing!?
//user table : petition + image (null); bio

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
        console.log(
            "this id-valu is given to cookie after registration: ",
            result.rows[0].id
        );
        req.session.userId = result.rows[0].id;
        res.json({
            success: true
        });
    } catch (error) {
        res.json({
            success: false
        });

        console.log("error in post registration: ", error);
    }
});

app.post("/login", async (req, res) => {
    console.log("server: post-login runs");
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

        console.log("error in post login: ", error);
    }
});

app.get("/api/user", async (req, res) => {
    //add api/ everywhere
    console.log("get user route running");
    try {
        let userId = req.session.userId;
        console.log("userId: ", userId);
        let userData = await db.getUserData(userId);
        console.log("userData:", userData.rows[0]);
        let { first, last, image, bio } = userData.rows[0];
        console.log("first ", first);
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
    //add api/ everywhere
    console.log("get otheruser route running");
    try {
        let userId = req.session.userId;
        let otherId = req.params.id;
        if (userId != otherId) {
            let otherUserData = await db.getUserData(otherId);
            console.log("otherUserData:", otherUserData.rows[0]);
            let { first, last, image, bio } = otherUserData.rows[0];
            console.log("first ", first);
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
    //add api/ everywhere
    console.log("findlatestusers route running");
    try {
        let latestUsers = await db.getLatestUsers();
        console.log("latestUsers:", latestUsers.rows);
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
    console.log("seachusers route running");
    console.log(req.params.str);
    let str = req.params.str;
    try {
        let resultUsers = await db.searchUsers(str);
        console.log("resultUsers:", resultUsers.rows);
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
    console.log("friendship route running");
    let otherId = req.params.otherId;
    let ownId = req.session.userId;
    console.log(otherId, ownId);
    try {
        let resultFriendship = await db.getFriendshipStatus(otherId, ownId);
        console.log("resultFriendship: ", resultFriendship);
        res.json({
            resultFriendship: resultFriendship.rows,
            ownId: ownId,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});

app.post("/api/send-friend-request/:otherId", async (req, res) => {
    console.log("send-friend-request running");
    let otherId = req.params.otherId;
    let ownId = req.session.userId;
    try {
        let sendFriendRequest = await db.sendFriendRequest(otherId, ownId);
        console.log("result sendFriendRequest: ", sendFriendRequest);
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});

app.post("/api/accept-friend-request/:otherId", async (req, res) => {
    console.log("accept-friend-request running");
    let otherId = req.params.otherId;
    let ownId = req.session.userId;
    try {
        let acceptFriendRequest = await db.acceptFriendRequest(otherId, ownId);
        console.log("result acceptFriendRequest: ", acceptFriendRequest);
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});

app.post("/api/end-friendship/:otherId", async (req, res) => {
    console.log("end-friendship running");
    let otherId = req.params.otherId;
    let ownId = req.session.userId;
    try {
        let endFriendship = await db.endFriendship(otherId, ownId);
        console.log("result endFriendship: ", endFriendship);
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});

app.post("/uploadImage", uploader.single("file"), s3.upload, (req, res) => {
    console.log("req.file.filename: ", req.file.filename);
    // sconst { title } = req.body;
    const imageUrl = `${s3Url}/${req.file.filename}`;
    let userId = req.session.userId;
    console.log(" imageUrl: ", imageUrl);
    db.addImage(imageUrl, userId)
        .then(result => {
            console.log("result: ", result);
            res.json({
                success: true,
                image: result.rows[0].image
            });
        })
        .catch(err => {
            console.log("error in post: ", err);
        });
});

app.post("/updateBio", async (req, res) => {
    console.log("req.body: ", req.body);
    let userId = req.session.userId;
    let bio = req.body.bio;
    try {
        let bioData = await db.updateBio(bio, userId);
        console.log("das kommt als 'bio' von db zurück: ", bioData, bio);
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
    console.log("friends-wannabees running");
    let ownId = req.session.userId;

    try {
        let friendsAndWannabees = await db.getFriendsAndWannabees(ownId);
        console.log("resultFriendship: ", friendsAndWannabees);
        res.json({
            friendsAndWannabees: friendsAndWannabees.rows,
            success: true
        });
    } catch (error) {
        console.log(error);
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
    console.log("I'm listening.");
});

io.on("connection", function(socket) {
    console.log(`socket with the id ${socket.id} is now connected`);
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    let userId = socket.request.session.userId;
    db.getUserData(userId).then(data => {
        let { first, last, image, id } = data.rows[0];
        console.log("first, last, image: ", first, last, image, id);
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
                console.log("CHECK FOR NEW USER: ", item.id, newOnlineUser.id);
                checkIfNew = false;
            }
        });

        if (checkIfNew !== false) {
            console.log("CHECK IF NEW TRUE!!!");
            onlineUsers.push(newOnlineUser);
        }

        io.sockets.emit("usersOnlineList", onlineUsers);
    });

    //put in on other users profile

    db.getLastTenChatMessages()
        .then(data => {
            io.sockets.emit("chatMessages", data.rows.reverse());
            console.log("data.rows.reverse(): ", data.rows.reverse());
        })

        .catch(err => {
            console.log(err);
        });

    /* ... */
    socket.on("newChatMessage", msg => {
        console.log("msg on the server: ", msg);
        console.log("userID: ", userId);
        userId = socket.request.session.userId;

        db.addNewMessage(msg, userId)
            .then(data => {
                let messageId = data.rows[0].message_id;
                db.getLatestChatMessage(messageId).then(data => {
                    console.log("lates message before emiting ", data.rows[0]);
                    io.sockets.emit("additionalMessage", data.rows[0]);
                });
            })

            .catch(err => {
                console.log(err);
            });

        //than add it to
        // then emit this object to everyone
    });
    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter(function(obj) {
            return obj.socketid !== socket.id;
        });
    });
});
