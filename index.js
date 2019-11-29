const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const db = require("./utils/db"); //we need it???
const { hash, compare } = require("./utils/bc");
const csurf = require("csurf");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config.json");

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

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

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

app.get("/user", async (req, res) => {
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

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
