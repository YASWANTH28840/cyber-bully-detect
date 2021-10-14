const bodyParser = require("body-parser"),
    express = require("express"),
    mongoose = require("mongoose"),
    cors = require("cors"),
    postRouter = require("./routes/post.router"),
    userRouter = require("./routes/user.router"),
    authRouter = require("./routes/auth.router"),
    Post = require("./models/post.model"),
    User = require("./models/user.model");
app = express();
require("dotenv").config();
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept",
    );
    next();
});
app.get("/", async (req, res) => {
    // const user = new User({
    //     bio:
    //         "Cillum voluptate ut tempor aliquip aliquip deserunt qui ut officia. Exercitation esse eu voluptate tempor excepteur ut deserunt irure labore enim. Do mollit nisi cillum sit eu cupidatat amet voluptate quis ipsum ad quis id. Id officia adipisicing enim esse non exercitation do minim id quis Lorem. Eu pariatur pariatur laboris reprehenderit sunt culpa do adipisicing ad.",
    //     email: "Jayant@gmail.com",
    //     followers: [],
    //     following: [
    //         {
    //             id: "608479f5c3147a3128c3263c",
    //             username: "Sparsh Jain",
    //         },
    //     ],
    //     name: "Jayant Malik",
    //     password: "Jayant_password",
    // });
    spa = await User.findById("60898c53ebf6592668fe9a36");
    posts = await Post.find(
        { "author.id": spa._id },
        { _id: 1, image: 1 },
    ).lean();
    spa.posts = posts.map((post) => {
        return {
            id: post._id,
            image: post.image,
        };
    });
    console.log(posts);
    // spa.followers.push({
    //     username: user.name,
    //     id: user._id,
    // });

    // await spa.save();
    // await user.save();
    res.json({ spa, posts });
});
app.use(bodyParser.json());
app.use("/data", express.static("data"));
app.use("/api/post", postRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
const MONGO_URI = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.8bvsg.mongodb.net/cyber_bully_db?retryWrites=true&w=majority`;

mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => console.log("connected to MONGO 🤩"))
    .catch((x) => console.log(x));

const port = 8080 || process.env.PORT;
app.listen(port, () => {
    console.log(`Listening to ${port} `);
});
