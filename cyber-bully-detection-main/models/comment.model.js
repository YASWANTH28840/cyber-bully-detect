const mongoose = require("mongoose");
const { Schema } = mongoose;
const CommentSchema = new Schema(
    {
        text: {
            type: String,
        },
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            username: String,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Comment", CommentSchema);
