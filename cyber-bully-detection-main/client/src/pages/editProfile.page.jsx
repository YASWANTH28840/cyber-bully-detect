import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Card, CardTitle, CardText, Input, Label, Button } from "reactstrap";
import AuthContext from "../context/auth.context";
import img from "../assets/PNG/Transparent/user.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faAngleUp,
    faThumbsUp,
    faUpload,
} from "@fortawesome/free-solid-svg-icons";
// import AnimatedBackground from "../components/animatedBackground.component";
// import { types, images } from "../assets/data";
import axios from "axios";
const EditProfile = () => {
    const history = useHistory();
    const context = useContext(AuthContext);
    const [user, setuser] = useState(null);
    const [image, setimage] = useState(null);
    const [file, setfile] = useState(null);
    const [uploading, setuploading] = useState(false);
    // const [updateuser,setupdateuser]=useState(null);
    const [following, setfollowing] = useState(false);
    useEffect(() => {
        axios
            .get(`/api/user/${context.user.id}`)
            .then(({ data }) => {
                console.log(data);
                setuser({
                    name: data.user.name,
                    bio: data.user.bio,
                    image: data.user.image,
                });
                setimage(data.user.image ? data.user.image : null);
            })
            .catch((err) => console.log(err));
    }, []);
    const handleChange = (e) =>
        setuser({
            ...user,
            [e.target.name]: e.target.value,
        });
    const submit = async () => {
        if (user.name === "") {
            alert("REQUIRED NAME");
            return;
        }
        let body = new FormData();
        await body.append("image", user.file ? user.file : file);
        await body.append("name", user.name);
        await body.append("bio", user.bio);
        console.log(body);
        axios
            .post("/api/user/edit", body, {
                headers: {
                    Authorization: `Bearer ${context.token}`,
                },
            })
            .then(({ data }) => {
                console.log(data);
                history.push(`/user/${context.user.id}`);
            })
            .catch(({ response }) => console.log(response));
    };
    const uploadImage = (e) => {
        setuploading(true);
        const files = Array.from(e.target.files);
        if (files.length !== 0) {
            if (
                files[0].type.split("/")[0] !== "image" ||
                files[0].size > 5000000
            ) {
                console.log("wrong");
                setuploading(false);
                alert("INVALID FORMAT");
                return;
            }
            let reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = () => {
                console.log(reader.result);
                setfile(files[0]);
                setuser({ ...user, image: files[0] });
                setimage(reader.result);
                setuploading(false);
            };
        }
    };
    return (
        <>
            {user && (
                <>
                    <div className='row flex-row w-100 profile mx-0 mt-4'>
                        <div className='col-12 col-md-4 p-2 mb-auto text-align-center'>
                            <img
                                src={image ? `/${image}` : img}
                                className='img-fluid profile-img'
                                alt='photu'
                            />
                            <div className='flex-row-center '>
                                <button className='btn btn-secondary m-2 btn-float'>
                                    <label
                                        htmlFor='image'
                                        style={{
                                            display: "inline-block",
                                            margin: 0,
                                            cursor: "pointer",
                                            width: "100%",
                                        }}>
                                        Change Image
                                        <FontAwesomeIcon
                                            icon={faUpload}
                                            className='like ml-2'
                                            title='Like the post'
                                        />
                                    </label>
                                </button>

                                <input
                                    type='file'
                                    style={{
                                        zIndex: "-1",
                                        overflow: "hidden",
                                        opacity: 0,
                                        cursor: "pointer",
                                    }}
                                    id='image'
                                    accept='image/*'
                                    onChange={uploadImage}
                                />
                            </div>
                        </div>
                        <div className='col-12 col-md-8 p-3 content'>
                            <CardTitle tag='h3' className='text-align-center'>
                                <Input
                                    value={user.name}
                                    name='name'
                                    onChange={handleChange}
                                />
                            </CardTitle>
                            <CardText>
                                <Input
                                    type='textarea'
                                    rows={4}
                                    className='text-align-justify'
                                    value={user.bio}
                                    onChange={handleChange}
                                    name='bio'
                                />
                            </CardText>
                            <Button onClick={submit} disabled={uploading}>
                                Update Profile
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
export default EditProfile;
