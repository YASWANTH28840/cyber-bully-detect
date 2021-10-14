const router = require("express").Router();
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");
const { checkText, checkImage } = require("../helper/bully");
const { populateComment } = require("../helper/index");
const verifyToken = require("../middleware/auth");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./data/images");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    },
});
const fileFilter = async (req, file, cb) => {
    const bool = await checkImage(file);
    if (!bool) req.error = "CYBER BULLY";
    if (
        req.isAuth &&
        (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
    ) {
        cb(null, true);
    } else {
        req.error = "INVALID TYPE";
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
});

router.get("/", async (req, res) => {
    try {
        let posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({
                path: "comments",
                populate: {
                    path: "id",
                    model: "Comment",
                },
            })
            .lean();
        res.json({
            feed: posts.map((post) => {
                return {
                    ...post,
                    comments: post.comments.map((comment) => {
                        const id = comment.id;
                        return {
                            ...comment,
                            id: id.id,
                            author: id.author,
                            createdAt: id.createdAt,
                        };
                    }),
                };
            }),
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//Route for sending the posts of only following accounts
/*
router.get("/", verifyToken, async (req, res) => {
    try {
        let user = await User.findById(req.user.id).lean();
        const foll = user.following.map((x) => x.id);
        let posts = await Post.find({ "author.id": { $in: foll } })
            .sort({ createdAt: -1 })
            .populate({
                path: "comments",
                populate: {
                    path: "id",
                    model: "Comment",
                },
            })
            .lean();
        res.json({
            feed: posts.map((post) => {
                return {
                    ...post,
                    comments: post.comments.map((comment) => {
                        const id = comment.id;
                        return {
                            ...comment,
                            id: id.id,
                            author: id.author,
                            createdAt: id.createdAt,
                        };
                    }),
                };
            }),
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "NOT_AUTHORIZED" });
    }
});
*/
router.get("/:id", async (req, res) => {
    try {
        let post = await Post.findById(req.params.id)
            .populate({
                path: "comments",
                populate: {
                    path: "id",
                    model: "Comment",
                },
            })
            .lean();
        if (!post) throw new Error("INVALID_POST");
        // console.log(post);
        res.json({
            post: {
                ...post,
                comments: post.comments
                    ? post.comments.map((comment) => {
                          const id = comment.id;
                          return {
                              ...comment,
                              id: id.id,
                              author: id.author,
                              createdAt: id.createdAt,
                          };
                      })
                    : [],
            },
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
});

router.post("/", verifyToken, upload.single("image"), async (req, res) => {
    try {
        if (!req.isAuth) throw new Error("NOT_AUTHORIZED");
        if (req.error) throw new Error(req.error);
        const score = await checkText(req.body.text);
        if (score > 0.5) throw new Error("VULGAR_CAPTION");
        console.log(req.file.path);
        const post = new Post({
            text: req.body.text,
            image: req.file.path,
            likes: [],
            comments: [],
            author: {
                id: req.user.id,
                username: req.user.username,
            },
        });
        let user = await User.findById(req.user.id);
        user.posts.push({ id: post._id, image: post.image });
        // await post.save();
        // await user.save();
        res.json({ status: "posted", post: post, image: req.file.path });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
router.post("/comment", verifyToken, async (req, res) => {
    try {
        if (!req.isAuth) throw new Error("NOT_AUTHORIZED");
        const score = await checkText(req.body.comment);
        if (score > 0.5) throw new Error("VULGAR_COMMENT");
        post = await Post.findById(req.body.id);
        const comment = new Comment({
            text: req.body.comment,
            author: {
                id: req.user.id,
                username: req.user.username,
            },
        });
        post.comments = [
            ...post.comments,
            { id: comment._id, text: comment.text },
        ];
        await comment.save();
        await post.save();

        return res.json({ status: "added", post: post, comment: comment });
    } catch (err) {
        res.status(500).json({
            error: err.message ? err.message : "Try again",
        });
    }
});
router.post("/like", verifyToken, async (req, res) => {
    try {
        if (!req.isAuth) throw new Error("NOT_AUTHORIZED");
        post = await Post.findById(req.body.id);
        const x = post.likes.filter((like) => {
            console.log(like.id, req.user.id);
            return like.id == req.user.id;
        });
        console.log(x);
        if (x.length) return res.status(500).json({ error: "ALREADY_LIKED" });
        post.likes = [
            ...post.likes,
            { id: req.user.id, username: req.user.username },
        ];
        console.log(post);
        await post.save();
        res.json({ status: "liked", post: post });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
module.exports = router;
