import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useParams, useHistory } from "react-router-dom";
import { Card, CardTitle, CardText, Input, Label, Button } from "reactstrap";
import AuthContext from "../context/auth.context";
import img from "../assets/PNG/Transparent/user.png";
// import AnimatedBackground from "../components/animatedBackground.component";
// import { types, images } from "../assets/data";
import axios from "axios";
const Profile = () => {
    const history = useHistory();
    const context = useContext(AuthContext);
    const { id } = useParams();
    const [user, setuser] = useState(null);
    const [following, setfollowing] = useState(false);
    useEffect(() => {
        console.log(id);
        axios
            .get(`/api/user/${id}`)
            .then(({ data }) => {
                console.log(data);
                setuser(data.user);
                setfollowing(
                    data.user.followers
                        .map((x) => x.id)
                        .includes(context.user.id),
                );
                console.log(data.user.followers.map((x) => x.id));
                console.log(context.user.id);
            })
            .catch((err) => console.log(err));
    }, []);
    const follow = () => {
        if (following) alert("ALREADY_FOLLOWING");
        axios
            .post(
                "/api/user/follow",
                { id },
                {
                    headers: {
                        Authorization: `Bearer ${context.token}`,
                    },
                },
            )
            .then((x) => {
                console.log(x);
                setfollowing(true);
                setuser({
                    ...user,
                    followers: [
                        ...user.followers,
                        {
                            id: context.user.id,
                            username: context.user.username,
                        },
                    ],
                });
            })
            .catch((e) => {
                console.log(e?.response);
                console.log(e);
                alert(e?.response?.data?.error);
            });
    };
    return (
        <>
            {user && (
                <>
                    <div className='row flex-row w-100 profile mx-0 mt-4'>
                        <div className='col-12 col-md-4 p-2 mb-auto text-align-center'>
                            <img
                                src={user.image ? `/${user.image}` : img}
                                className='img-fluid profile-img'
                                alt='photu'
                            />
                            <div className='p-2 w-100 mt-2'>
                                {context?.user?.id === id ? (
                                    <Link
                                        to='/user/edit'
                                        className='follow-button btn btn-secondary'
                                        disabled={
                                            context.token
                                                ? following
                                                : !context.token
                                        }>
                                        Edit Profile
                                    </Link>
                                ) : (
                                    context.token && (
                                        <Button
                                            onClick={follow}
                                            className='follow-button'
                                            disabled={following}>
                                            {following
                                                ? "Following 🤙"
                                                : "Follow"}
                                        </Button>
                                    )
                                )}
                            </div>
                        </div>
                        <div className='col-12 col-md-8 p-3 content'>
                            <CardTitle tag='h3' className='text-align-center'>
                                {user.name}
                            </CardTitle>
                            <CardTitle
                                tag='h5'
                                className='row justify-content-around'>
                                <span className=' pl-0 center-md my-1 '>
                                    {user.posts.length} posts
                                </span>
                                <span className=' center-md my-1 '>
                                    {user.following.length} following
                                </span>
                                <span className=' center-md my-1  pr-0'>
                                    {user.followers.length} followers
                                </span>
                            </CardTitle>

                            <CardText>
                                <p className='text-align-justify'>{user.bio}</p>
                            </CardText>
                        </div>
                    </div>

                    <div className='flex-grow-1 pt-3  position-relative user-posts'>
                        <h4 className='text-align-center'>Posts</h4>
                        <hr />
                        <div className='col-12 col-md-10 col-lg-9 mx-auto px-2 px-md-0 row justify-content-around'>
                            {user.posts.map((post) => (
                                <div className='col-12 col-md-4 p-2 border my-1 d-flex flex-column '>
                                    <div className='flex-grow-1 vertical-center'>
                                        <img
                                            src={`/${post.image}`}
                                            className='img-fluid '
                                            alt=''
                                        />
                                    </div>
                                    <Link
                                        className='w-100 my-1 btn btn-primary'
                                        to={`/post/${post.id}`}>
                                        View Post
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
export default Profile;
