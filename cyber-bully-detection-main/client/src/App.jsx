import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Home from "./pages/home.page";
import PostPage from "./pages/post.page";
import Post from "./components/post.component";
import Feed from "./pages/feed.page";
import Auth from "./pages/auth.page";
import Profile from "./pages/profile.page";
import EditProfile from "./pages/editProfile.page";
import Navbar from "./components/navbar.component";
import AuthContext from "./context/auth.context";
import { Component } from "react";
import Loader from "./components/loader.component";
const ProtectedRoute = ({ component: Comp, loggedIn, path, ...rest }) => {
    return (
        <Route
            path={path}
            {...rest}
            render={(props) => {
                return loggedIn ? (
                    <Comp {...props} />
                ) : (
                    <Redirect to='/auth/login' />
                );
            }}
        />
    );
};
class App extends Component {
    state = {
        loading: true,
        token: null,
        user: null,
    };
    componentDidMount() {
        this.setState({ loading: false });
        if (localStorage.getItem("user")) {
            const user = JSON.parse(localStorage.getItem("user"));
            console.log(user);
            console.log(new Date(user.expiry) > new Date());
            if (new Date(user.expiry) < new Date()) {
                console.log("EXPIRED !!!");
                this.logout();
            } else this.setState({ loading: false, ...user });
        } else {
            const { loading, ...user } = this.state;
            localStorage.setItem("user", JSON.stringify(user));
        }
    }
    login = (token, tokenExpiration, user) => {
        this.setState({ token, user });
        localStorage.setItem(
            "user",
            JSON.stringify({
                token,
                user,
                expiry: new Date(
                    new Date().getTime() + 60000 * 60 * tokenExpiration,
                ),
            }),
        );
    };
    logout = () => {
        this.setState({
            token: null,
            user: null,
        });
        localStorage.removeItem("user");
    };
    render() {
        return (
            <BrowserRouter>
                <AuthContext.Provider
                    value={{
                        token: this.state.token,
                        user: this.state.user,
                        login: this.login,
                        logout: this.logout,
                    }}>
                    <Navbar />
                    {this.state.loading ? (
                        <div className='my-30vh'>
                            <Loader />
                        </div>
                    ) : (
                        <main className='d-flex flex-column'>
                            <Switch>
                                <Route path='/' exact component={Home} />
                                <ProtectedRoute
                                    path='/post'
                                    loggedIn={this.state.token}
                                    exact
                                    component={PostPage}
                                />
                                <ProtectedRoute
                                    loggedIn={this.state.token}
                                    path='/feed'
                                    exact
                                    component={Feed}
                                />
                                <ProtectedRoute
                                    loggedIn={this.state.token}
                                    path='/user/edit'
                                    exact
                                    component={EditProfile}
                                />
                                <Route
                                    path='/post/:id'
                                    exact
                                    component={Post}
                                />
                                <Route
                                    path='/user/:id'
                                    exact
                                    component={Profile}
                                />
                                <Route
                                    path='/auth/login'
                                    exact
                                    component={Auth}
                                />
                                <Route
                                    path='/auth/signup'
                                    exact
                                    component={Auth}
                                />
                            </Switch>
                        </main>
                    )}
                </AuthContext.Provider>
            </BrowserRouter>
        );
    }
}

export default App;
