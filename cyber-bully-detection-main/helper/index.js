const Comment = require("../models/comment.model");
const transformComment = async (comment) => {
    try {
        const x = await Comment.findById(comment.id).lean();
        comment.author = x.author;
        console.log(comment);
        return comment;
    } catch (e) {
        console.log(e);
    }
};

const populateComment = (post) => {
    // console.log(comments);

    return {
        ...post,
        comments: post.comments.map((comment) => transformComment(comment)),
    };
    // return comments.map(async (comment) => {
    // const x = await Comment.findById(id).lean();
    // console.log(x);
    // return x;
    // comment = {
    //     ...comment,
    //     author: x.author,
    // };
    // console.log(comment);
    // return comment;
    // });
};
module.exports = { populateComment };
