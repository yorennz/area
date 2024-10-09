import { useState, createContext, ReactNode } from "react";

import ApiCommunication from "./Communication";
import { useCookies } from "react-cookie";

type MainContextType = {
    isLogged: boolean;
    API: ApiCommunication;
    accesToken: any;
    me: any;
    AboutJSON: any;
    logout: () => void;
    deleteAccount: () => void;
};

const MainContext = createContext<MainContextType | undefined>(undefined);

const MainProvider = ({ children }: { children: ReactNode }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [accesToken, setAccesToken] = useState<string | undefined>(undefined);
    const [me, setMe] = useState([]);
    const [AboutJSON, setAboutJSON] = useState([]);
    const [, , removeCookie] = useCookies();

    const API = new ApiCommunication(
        setIsLogged,
        setAccesToken,
        setMe,
        setAboutJSON
    );

    const logout = () => {
        setIsLogged(false);
        setAccesToken(undefined);
        setAboutJSON([]);
        setMe([]);
        removeCookie("user", { path: "/" });
    };

    const deleteAccount = () => {
        if (accesToken) API.delUser(accesToken);
        logout();
    };

    const contextData = {
        API,
        logout,
        isLogged,
        setIsLogged,
        accesToken,
        setAccesToken,
        me,
        setMe,
        deleteAccount,
        AboutJSON,
        setAboutJSON,
    };

    return (
        <MainContext.Provider value={contextData}>
            {children}
        </MainContext.Provider>
    );
};

export { MainContext, MainProvider };
