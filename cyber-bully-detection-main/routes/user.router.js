const router = require("express").Router(),
    verifyToken = require("../middleware/auth"),
    User = require("../models/user.model");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./data/images/profile");
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(
            null,
            `${Date.now()}_${req.user.id}_${req.user.username}.${
                file.originalname.split(".")[1]
            }`,
        );
    },
});
const fileFilter = (req, file, cb) => {
    console.log(req.isAuth);
    if (
        req.isAuth &&
        file &&
        (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
    ) {
        cb(null, true);
    } else {
        // rejects storing a file
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
        const users = await User.find({}, { password: 0 }).lean();
        return res.json({ users: users });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id, { password: 0 }).lean();
        if (!user) throw new Error("USER_NOT_FOUND");
        return res.json({ user: user });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
router.post("/edit", verifyToken, upload.single("image"), async (req, res) => {
    try {
        if (!req.isAuth) throw new Error("NOT_AUTHORIZED");
        let user = await User.findById(req.user.id, { password: 0 });
        if (!user) throw new Error("USER_NOT_FOUND");
        // console.log(req.file.path);
        user.name = req.body.name;
        user.bio = req.body.bio;
        user.image = req.file ? req.file.path : null;
        await user.save();

        return res.json({ user: user._doc });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
router.post("/follow", verifyToken, async (req, res) => {
    try {
        if (!req.isAuth) throw new Error("NOT_AUTHORIZED");
        if (req.user.id === req.params.id) throw new Error("CANT_FOLLOW");
        const foll = await User.findById(req.body.id); //J
        const current = await User.findById(req.user.id); //R
        console.log(
            current.following.map((x) => x.id + ""),
            req.body.id,
        );
        if (current.following.map((x) => x.id).includes(req.body.id))
            throw new Error("ALREADY_FOLLOWING");

        current.following.push({ id: req.body.id, username: foll.name });
        foll.followers.push({ id: req.user.id, username: current.name });
        await current.save();
        await foll.save();
        return res.json({ status: "DONE" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
module.exports = router;
