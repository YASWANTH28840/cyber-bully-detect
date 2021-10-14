import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import img from "../assets/PNG/Transparent/7 Social Media.png";
// import AnimatedBackground from "../components/animatedBackground.component";
// import { types, images } from "../assets/data";
const Home = () => {
    return (
        <>
            <div style={{ padding: "3vh" }} className='flex-grow-1 bg-lightbg '>
                <div
                    className='row mx-0'
                    style={{ minHeight: "40vh", flexDirection: "row-reverse" }}>
                    <div className='col-12 col-md-6 col-lg-5 d-flex justify-content-center'>
                        <img src={img} className='img-fluid' alt='photu' />
                    </div>
                    <div className='col-12 col-md-6 col-lg-7 my-auto d-flex flex-row justify-content-center'>
                        <div className='text-align-start banner'>
                            <h1 className='text-gray'>XYZ_MEDIA </h1>
                            <p style={{ color: "var(--black)" }}>
                                A Social media platfom for connecting people.
                            </p>

                            <div>
                                <Link
                                    to='/feed'
                                    className='btn btn-sm btn-secondary ml-1'>
                                    View Feed
                                </Link>
                                <Link
                                    to='/post'
                                    className='btn btn-sm btn-outline-secondary ml-1'>
                                    Create a POST
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Home;
