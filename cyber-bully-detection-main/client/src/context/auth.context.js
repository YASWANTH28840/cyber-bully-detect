import { createContext } from "react";
export default createContext({
    token: null,
    user: null,
    login: (token, tokenExpiration, user) => {},
    logout: () => {},
});
