import React, { useState, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
// import logo from "../assets/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Alert,
    Nav,
    NavItem,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownItem,
    DropdownMenu,
} from "reactstrap";
// import { types } from "../assets/data";
import AuthContext from "../context/auth.context";

const NavbarComponent = () => {
    const context = useContext(AuthContext);
    const [error] = useState("");
    const [showError, setShowError] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Alert
                color='danger'
                isOpen={showError}
                toggle={() => {
                    setShowError(false);
                }}>
                {error}
            </Alert>
            <Navbar
                fixed='true'
                expand='lg'
                className='justify-content-between'
                style={{ zIndex: "1" }}>
                <div>
                    <Link
                        to='/'
                        className='navbar-brand Raleway text-align-center'>
                        <img
                            // src={logo}
                            alt=''
                            className='img-fluid mr-1'
                            style={{ maxHeight: "30px" }}
                        />
                        XYZ_MEDIA
                    </Link>
                </div>
                <NavbarToggler
                    onClick={toggle}
                    className={` position-relative ${
                        !isOpen ? "collapsed" : ""
                    }`}>
                    <span className='icon-bar'></span>
                    <span className='icon-bar'></span>
                    <span className='icon-bar'></span>
                </NavbarToggler>

                <Collapse
                    isOpen={isOpen}
                    navbar
                    className='justify-content-lg-center'>
                    <Nav
                        className='row justify-content-center pl-5 pr-3 w-100'
                        navbar>
                        <NavItem className='m-1 my-2 my-lg-1 ml-lg-auto'>
                            <NavLink to='/' exact>
                                Home
                            </NavLink>
                        </NavItem>
                        {/* <NavItem className='m-1 my-2 my-lg-1'>
                            <NavLink to='/about'>About</NavLink>
                        </NavItem> */}
                        <NavItem className='m-1 my-2 my-lg-1'>
                            <NavLink to='/feed'>Feed</NavLink>
                        </NavItem>
                        <NavItem className='m-1 my-2 my-lg-1'>
                            <NavLink to='/post'>Create a post</NavLink>
                        </NavItem>
                        {context.token ? (
                            <NavItem className='m-1 my-2 my-lg-1'>
                                <NavLink
                                    to={`/user/${context.user.id}`}
                                    className='active'>
                                    <FontAwesomeIcon
                                        size='lg'
                                        icon={faUserCircle}
                                        className='mr-1'
                                    />
                                    {context.user.username}
                                </NavLink>
                                <UncontrolledDropdown
                                    nav
                                    inNavbar
                                    className='display-inline px-0'>
                                    <DropdownToggle
                                        nav
                                        caret
                                        className='display-inline px-0'></DropdownToggle>
                                    <DropdownMenu className='dropdown-menu-right'>
                                        <DropdownItem onClick={context.logout}>
                                            Logout
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </NavItem>
                        ) : (
                            <NavItem className='m-1 my-2 my-lg-1'>
                                <NavLink to='/auth/login'>Login</NavLink>
                            </NavItem>
                        )}
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
};
export default NavbarComponent;
