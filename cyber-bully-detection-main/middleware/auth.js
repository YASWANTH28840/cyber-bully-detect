const jwt = require("jsonwebtoken");
module.exports = verifyToken = (req, res, next) => {
    console.log("INSIDE");
    const authHeader = req.get("Authorization");
    req.isAuth = false;

    if (!authHeader) return next();

    //* Authorization : Bearer *****************************
    const token = authHeader.split(" ")[1];
    if (!token || token === " ") return next();

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SECRET);
    } catch (err) {
        return next();
    }
    if (!decodedToken) return next();
    req.isAuth = true;
    req.user = { id: decodedToken.userId, username: decodedToken.username };
    next();
};
