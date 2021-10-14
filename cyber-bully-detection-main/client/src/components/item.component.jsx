import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardTitle, CardText, Input, Label, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faAngleUp,
    faPlusCircle,
    faPlusSquare,
    faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../context/auth.context";
import axios from "axios";
import Loader from "./loader.component";
const Item = ({ post }) => {
    const context = useContext(AuthContext);
    const [loading, setloading] = useState(false);
    const [item, setitem] = useState(post);
    const [imgLoaded, setimgloaded] = useState(false);
    useEffect(() => {
        setitem(post);
        setliked(
            post.likes.filter(
                (like) => like.username === context?.user?.username,
            ).length !== 0,
        );
    }, [post, context]);
    const [reviewToggle, setReviewToggle] = useState(false);
    const [addComment, setaddComment] = useState(false);
    const [liked, setliked] = useState(false);
    const [comment, setcomment] = useState("");
    const days = parseInt(
        (new Date() - new Date(item.createdAt)) / (1000 * 60 * 60 * 24),
        10,
    );
    const handleChange = (e) => setcomment(e.target.value);
    const postComment = () => {
        if (!context.token) {
            alert("<a>Login First</a>");
            return;
        }
        console.log(comment);

        const query = {
            comment,
            id: item._id,
        };
        setloading(true);

        axios
            .post("/api/post/comment", query, {
                headers: {
                    Authorization: `Bearer ${context.token}`,
                },
            })
            .then(({ data }) => {
                console.log(data);

                setitem({
                    ...item,
                    comments: [...item.comments, data.comment],
                });
                setaddComment(false);
                setReviewToggle(true);
                setloading(false);
            })
            .catch((err) => {
                console.log(err, err.response);
                setloading(false);
                alert(err?.response?.data?.error);
            });
    };
    const like = () => {
        if (!context.token) {
            alert("Login First");
            return;
        }
        axios
            .post(
                "/api/post/like",
                { id: item._id },
                {
                    headers: {
                        Authorization: `Bearer ${context.token}`,
                    },
                },
            )
            .then(({ data }) => {
                console.log(data);
                setliked(true);
                setitem({ ...item, likes: data.post.likes });
            })
            .catch((err) => console.log(err, err.response));
    };
    return (
        <>
            {loading && (
                <div className='loader'>
                    <Loader />
                </div>
            )}
            <Card className='row flex-row w-100 m-1 '>
                <div className='col-12 col-md-4 p-2 my-auto'>
                    <img
                        src={item.image}
                        className={`img-fluid smooth-image image-${
                            imgLoaded ? "visible" : "hidden"
                        }`}
                        alt='photu'
                        onLoad={() => setimgloaded(true)}
                    />

                    {!imgLoaded && (
                        <div className='my-auto'>
                            <Loader />
                        </div>
                    )}
                </div>
                <div className='col-12 col-md-8 p-3 content'>
                    <CardTitle tag='h5'>{item.title}</CardTitle>
                    <CardText>
                        <span>
                            <FontAwesomeIcon
                                icon={faThumbsUp}
                                title={`${
                                    liked ? "Already liked" : "Like the post"
                                }`}
                                className={`like ${liked && "liked unauth"}`}
                                onClick={like}
                            />
                            {item.likes.length} Likes
                            {item.likes.length > 0 && (
                                <span>
                                    {" "}
                                    | Liked By{" "}
                                    {item.likes.slice(0, 2).map((like, i) => (
                                        <Link
                                            to={`/user/${like.id}`}
                                            target='_blank'>
                                            {like.username}
                                            {i == item.likes.length - 1
                                                ? ""
                                                : ", "}
                                        </Link>
                                    ))}
                                </span>
                            )}
                        </span>
                        <br />
                        <strong>{item.author.username} : </strong>
                        {item.text.slice(0, 100)} ...
                    </CardText>
                    <CardText>
                        <div className='d-flex flex-row justify-content-between'>
                            {item.comments.length !== 0 && (
                                <span
                                    style={{ cursor: "pointer" }}
                                    className='text-primary'
                                    onClick={() =>
                                        setReviewToggle(!reviewToggle)
                                    }>
                                    View {item.comments.length} Comments{" "}
                                    <span>
                                        <FontAwesomeIcon
                                            icon={
                                                !reviewToggle
                                                    ? faAngleDown
                                                    : faAngleUp
                                            }
                                        />
                                    </span>
                                </span>
                            )}
                            <span
                                className={`link ${
                                    context.token ? "" : "unauth"
                                }`}
                                onClick={() => setaddComment(!addComment)}>
                                <FontAwesomeIcon
                                    className='mr-1'
                                    icon={faPlusSquare}
                                />
                                Comment
                            </span>
                        </div>
                        <div>
                            {reviewToggle &&
                                item.comments.map((comment, ind) => (
                                    <div className='review'>
                                        <strong>
                                            {comment?.author?.username} :{" "}
                                        </strong>
                                        {comment.text}
                                    </div>
                                ))}
                        </div>
                        {addComment && (
                            <div className='d-flex flex-row new-comment'>
                                <Label className='d-flex flex-column justify-content-center m-0'>
                                    <strong>
                                        {context?.user?.username} :{" "}
                                    </strong>
                                </Label>
                                <div className='flex-grow-1 ml-1 d-flex flex-row justify-content-between'>
                                    <Input
                                        type='textarea'
                                        name='comment'
                                        id='comment'
                                        placeholder='add a comment ...'
                                        onChange={handleChange}
                                        className='flex-grow-1 mr-1'
                                        value={comment}
                                        rows={1}
                                    />
                                    <Button
                                        size='sm'
                                        color='primary'
                                        disabled={comment.length === 0}
                                        onClick={postComment}>
                                        Post
                                    </Button>
                                </div>
                            </div>
                        )}
                        <small className='text-muted'>
                            Posted{" "}
                            {days === 0
                                ? "today"
                                : `${days} day${days === 1 ? "" : "s"} ago`}
                        </small>
                    </CardText>
                </div>
            </Card>
        </>
    );
};
export default Item;
