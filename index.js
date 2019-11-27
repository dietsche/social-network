const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const db = require("./utils/db"); //we need it???
const { hash, compare } = require("./utils/bc");
const csurf = require("csurf");

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

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/registration", (req, res) => {
    console.log("server: post-registration runs");
    hash(req.body["password"])
        .then(result => {
            let hashedPassword = result;

            db.addUserData(
                req.body["first"],
                req.body["last"],
                req.body["email"],
                hashedPassword
            )
                .then(result => {
                    req.session.userId = result.rows[0].id;
                    res.json({
                        success: true
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            res.json({
                success: false
            });

            console.log(err);
        });
});

//         .catch(err => {
//             res.render("login", {
//                 layout: "main",
//                 helpers: {
//                     showError() {
//                         return "Something went wrong! Please try again and fill out all fields.";
//                     }
//                 }
//             });
//             console.log(err);
//         });
// });

app.post("/login", (req, res) => {
    console.log("server: post-login runs");
    hash(req.body["password"]);
    db.getHashedPassword(req.body["email"])
        .then(result => {
            console.log("getHashedPassword completed");
            let savedPassword = result.rows[0].password;
            let userId = result.rows[0].id;
            console.log("savedPassword: ", savedPassword);
            console.log("userId: ", userId);

            compare(req.body["password"], savedPassword).then(result => {
                console.log(result);
                if (result == true) {
                    req.session.userId = userId;
                    res.json({
                        success: true
                    });
                } else if (result == false) {
                    res.json({
                        success: false
                    });
                }
            });
        })
        .catch(err => {
            res.json({
                success: false
            });
        });
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
