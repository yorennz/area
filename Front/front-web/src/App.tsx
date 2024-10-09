import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthRoutes from "./utils/AuthRoutes/AuthRoutes";
import PrivateRoutes from "./utils/PrivateRoutes/PrivateRoutes";
import Home from "./Home/Home";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import NoPage from "./NoPage/NoPage";
import Areas from "./Component/Areas/Areas";
import User from "./Component/User/User";
import Authorization from "./Component/Authorization/Authorization";
import Sidebar from "./Component/Sidebar/Sidebar";
import { MainProvider } from "./Context/AllContext";

function App() {
    return (
        <MainProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/">
                        <Route index element={<Home />} />
                        <Route element={<AuthRoutes />}>
                            <Route path="register" element={<Register />} />
                            <Route path="login" element={<Login />} />
                        </Route>
                        <Route element={<PrivateRoutes />}>
                            <Route element={<Sidebar />}>
                                <Route path="areas" element={<Areas />} />
                                <Route path="user" element={<User />} />
                                <Route
                                    path="authorization"
                                    element={<Authorization />}
                                />
                            </Route>
                        </Route>
                        <Route path="*" element={<NoPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </MainProvider>
    );
}

export default App;
