const router = require("express").Router(),
    jwt = require("jsonwebtoken"),
    bcrypt = require("bcrypt"),
    User = require("../models/user.model");

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) throw new Error("INVALID_EMAIL");
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) throw new Error("INVALID_PASSWORD");
        const token = await jwt.sign(
            { userId: user.id, email: user.email, username: user.name },
            process.env.SECRET,
            { expiresIn: "1h" },
        );
        return res.json({
            user: { id: user.id, email: user.email, username: user.name },
            token,
            tokenExpiration: 1,
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post("/signup", async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
        });
        if (user) throw new Error("EMAIL_EXISTS");
        const hashed = await bcrypt.hash(req.body.password, 12);
        const newUser = new User({
            ...req.body,
            password: hashed,
        });
        const result = await newUser.save();
        const token = jwt.sign(
            {
                userId: result.id,
                email: result.email,
                username: result.name,
            },
            process.env.SECRET,
            { expiresIn: "1h" },
        );
        return res.json({
            user: { id: result.id, email: result.email, username: result.name },
            token,
            tokenExpiration: 1,
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
module.exports = router;
