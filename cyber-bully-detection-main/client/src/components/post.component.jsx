import React, { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
    Card,
    CardTitle,
    CardText,
    Input,
    Label,
    Button,
    ListGroup,
    ListGroupItem,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faAngleUp,
    faPlusCircle,
    faPlusSquare,
    faThumbsUp,
    faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../context/auth.context";
import axios from "axios";
import Loader from "./loader.component";
const Post = () => {
    const { id } = useParams();
    const context = useContext(AuthContext);
    const [days, setdays] = useState("");
    const [post, setpost] = useState(null);
    const [imgLoaded, setimgloaded] = useState(false);
    useEffect(() => {
        axios
            .get(`/api/post/${id}`)
            .then(({ data }) => {
                console.log(data);
                setpost(data.post);
                setliked(
                    data.post.likes.filter(
                        (like) => like.username === context?.user?.username,
                    ).length !== 0,
                );
                setdays(
                    parseInt(
                        (new Date() - new Date(data.post.createdAt)) /
                            (1000 * 60 * 60 * 24),
                        10,
                    ),
                );
            })
            .catch((err) => console.log(err.response));
    }, [context]);
    const [reviewToggle, setReviewToggle] = useState(false);
    const [addComment, setaddComment] = useState(false);
    const [liked, setliked] = useState(false);
    const [comment, setcomment] = useState("");

    const handleChange = (e) => setcomment(e.target.value);
    const postComment = () => {
        if (!context.token) {
            alert("<a>Login First</a>");
            return;
        }
        console.log(comment);

        const query = {
            comment,
            id: post._id,
        };
        axios
            .post("/api/post/comment", query, {
                headers: {
                    Authorization: `Bearer ${context.token}`,
                },
            })
            .then(({ data }) => {
                console.log(data);

                setpost({
                    ...post,
                    comments: [...post.comments, data.comment],
                });
                setaddComment(false);
                setReviewToggle(true);
            })
            .catch((err) => console.log(err, err.response));
    };
    const like = () => {
        if (!context.token) {
            alert("Login First");
            return;
        }
        axios
            .post(
                "/api/post/like",
                { id: post._id },
                {
                    headers: {
                        Authorization: `Bearer ${context.token}`,
                    },
                },
            )
            .then(({ data }) => {
                console.log(data);
                setliked(true);
                setpost({ ...post, likes: data.post.likes });
            })
            .catch((err) => console.log(err, err.response));
    };
    return (
        post && (
            <div className='row w-100 '>
                <div className='col-12 p-2 my-auto text-align-center mx-0'>
                    <img
                        src={"/" + post.image}
                        className={`photu img-fluid  smooth-image image-${
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
                <div className='col-12 col-md-8 p-3 mx-auto content'>
                    <CardTitle tag='h5'>{post.title}</CardTitle>
                    <CardText>
                        <span>
                            <FontAwesomeIcon
                                icon={faThumbsUp}
                                title={`${
                                    liked ? "Already liked" : "Like the post"
                                }`}
                                className={`like ${
                                    liked && "liked unauth"
                                } mr-2`}
                                onClick={like}
                            />
                            {post.likes.length} Likes
                            {post.likes.length > 0 && (
                                <span>
                                    {" "}
                                    | Liked By{" "}
                                    {post.likes.slice(0, 2).map((like, i) => (
                                        <Link
                                            to={`/user/${like.id}`}
                                            target='_blank'>
                                            {like.username}
                                            {i == 1 ? "" : ", "}
                                        </Link>
                                    ))}
                                    {post.likes.length > 2 && (
                                        <>
                                            {" "}
                                            and{" "}
                                            <span className='link'>
                                                {post.likes.length - 2} more
                                            </span>
                                        </>
                                    )}
                                </span>
                            )}
                        </span>
                        <br />
                        {/* <div className='likes col-12 col-md-6 px-0'>
                            <h6 className='mt-1 mb-0'>Liked by:</h6>
                            <ListGroup flush>
                                {post.likes.map((like) => (
                                    <ListGroupItem>
                                        
                                        <Link to={`/user/${like.id}`}>
                                            {like.username}
                                        </Link>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        </div> */}
                        <br />
                        <p>
                            <strong>{post.author.username} : </strong>
                            {post.text}{" "}
                        </p>
                    </CardText>

                    <CardText>
                        <div className='d-flex flex-row justify-content-between'>
                            {post.comments.length !== 0 && (
                                <span
                                    style={{ cursor: "pointer" }}
                                    className='text-primary'
                                    onClick={() =>
                                        setReviewToggle(!reviewToggle)
                                    }>
                                    View {post.comments.length} Comments{" "}
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
                                post.comments.map((comment, ind) => (
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
            </div>
        )
    );
};
export default Post;
