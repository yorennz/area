import { useContext, useEffect, useState } from "react";
import "./AuthStyle.css";
import Background from "../Component/Background";
import { BiHide, BiShow } from "react-icons/bi";
import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./Checkbox.css";
import { MainContext } from "../Context/AllContext";

const Login = () => {
    const context = useContext(MainContext);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [, setCookie] = useCookies();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [toastError, setToastError] = useState({
        email: false,
        password: false,
    });

    const iconStyles: React.CSSProperties = {
        width: "100%",
        height: "100%",
        color: "#505050",
    };

    const [elems, setElems] = useState({
        email: {
            content: document.getElementById("email")!,
            error: "",
        },
        password: {
            content: document.getElementById("password")!,
            error: "",
        },
    });
    const [checkErrors, setCheckErrors] = useState(false);

    const checkEmail = () => {
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setElems((prevElems) => ({
                ...prevElems,
                email: {
                    ...prevElems.email,
                    error: "must be valid format",
                },
            }));
            return false;
        } else {
            setElems((prevElems) => ({
                ...prevElems,
                email: {
                    ...prevElems.email,
                    error: "",
                },
            }));
        }
        return true;
    };

    const checkForm = () => {
        let isValid = true;
        if (!checkEmail()) {
            isValid = false;
        }
        if (!isValid) {
            setCheckErrors(true);
        }
        return isValid;
    };

    const handleSubmit = async () => {
        try {
            if (!checkForm()) {
                throw new Error("invalid form");
            }
            const response = await axios.post(
                `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/auth/login`,
                {
                    email: email,
                    password: password,
                }
            );
            if (response.status === StatusCodes.OK) {
                context?.API.getMe(response?.data?.access_token);
                await setCookie(
                    "user",
                    JSON.stringify({
                        access_token: response?.data?.access_token,
                    }),
                    {
                        path: "/",
                        maxAge: 3600 * 12,
                        sameSite: "lax",
                    }
                );
                context?.API.getAbout();
                context?.API.getAuth();
                navigate("/areas");
            } else {
            }
        } catch (error) {
            const elems: HTMLElement[] = [
                document.getElementById("email")!,
                document.getElementById("password")!,
            ];
            elems.map((elem) => {
                elem.style.animation = "shake 0.2s ease-in-out 0s 2";
            });
            console.error(error);
        }
    };

    const loginWithOAuth2 = async () => {
        // appeller la fonction getme ensuite set le cookie une fois que la fonction getMe a finit
        try {
            const token = searchParams.get("token");
            if (!token) return;
            const response = context?.API.getMe(token);
            if (response) {
                await setCookie(
                    "user",
                    JSON.stringify({
                        access_token: token,
                    }),
                    {
                        path: "/",
                        maxAge: 3600 * 12,
                        sameSite: "lax",
                    }
                );
                context?.API.getAbout();
                context?.API.getAuth();
                navigate("/areas");
            }
        } catch (error) {
            console.error("error:", error);
        }
    };

    useEffect(() => {
        loginWithOAuth2();
        const timer = setTimeout(() => {
            const leftElement = document.getElementById("left");
            if (leftElement) {
                leftElement.style.opacity = "1";
                leftElement.style.animation = "slideInFromLeft 1s";
            }
        }, 2 * 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Background>
            <div className="containerLogin">
                <div id="left" className="left">
                    <div className="left--title">Welcome to Area</div>
                </div>
                <div className="right">
                    <div className="form">
                        <div className="form__header">
                            <div className="form__header--title">Sign in</div>
                        </div>
                        <div className="form__body">
                            <div className="form__body__input">
                                <label className="form__body__input--label">
                                    e-mail
                                    <span className="required">
                                        {" "}
                                        * {elems.email.error}
                                    </span>
                                </label>
                                <div
                                    id="email"
                                    className="form__body__input--box"
                                >
                                    <input
                                        className="login_input"
                                        type="email"
                                        name="email"
                                        // placeholder="example@gmail.com"
                                        maxLength={999}
                                        value={email}
                                        onChange={(event) => {
                                            setEmail(event?.target?.value);
                                            if (checkErrors) {
                                                checkEmail();
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="form__body__input">
                                <label className="form__body__input--label">
                                    password<span className="required"> *</span>
                                </label>
                                <div
                                    id="password"
                                    className="form__body__input--box"
                                >
                                    <input
                                        className="login_input"
                                        type={!showPwd ? "password" : "text"}
                                        name="password"
                                        // placeholder="password"
                                        maxLength={999}
                                        value={password}
                                        onChange={(event) => {
                                            setPassword(event?.target?.value);
                                        }}
                                    />
                                    <div
                                        className="form__body__input--icon"
                                        onClick={() => setShowPwd(!showPwd)}
                                    >
                                        {!showPwd ? (
                                            <BiShow style={iconStyles} />
                                        ) : (
                                            <BiHide style={iconStyles} />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="form__body__checkbox">
                                <input
                                    className="ui-checkbox"
                                    type="checkbox"
                                    onChange={(event) =>
                                        setRememberMe(event?.target?.checked)
                                    }
                                />{" "}
                                <span>Remember me</span>
                            </div>
                            <button onClick={handleSubmit}>Submit</button>
                            <div className="form__body--span">
                                <span>No account yet ?</span>{" "}
                                <a className="clickable" href={"/register"}>
                                    Sign up
                                </a>
                            </div>
                        </div>
                        <div className="form__footer">
                            <Link
                                to={`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/oauth2/login/google`}
                            >
                                <img
                                    className="auth_logo"
                                    src={require("../assets/google.png")}
                                />
                            </Link>
                            <Link to="https://www.google.com/">
                                <img
                                    className="auth_logo"
                                    src={require("../assets/facebook-logo.png")}
                                />
                            </Link>
                            <Link to="http://localhost:8080/oauth2/login/discord">
                                <img
                                    className="auth_logo"
                                    src={require("../assets/discord.png")}
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    );
};

export default Login;
