const mongoose = require("mongoose");
const { Schema } = mongoose;
const PostSchema = new Schema(
    {
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            username: String,
        },
        likes: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                username: String,
            },
        ],
        comments: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Comment",
                },
                text: String,
            },
        ],
        text: { type: String, trim: true },
        image: { type: String },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Post", PostSchema);
