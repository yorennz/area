import { useEffect, useState } from "react";
import "./AuthStyle.css";
import Background from "../Component/Background";
import { BiHide, BiShow } from "react-icons/bi";
import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Register = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("male");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirmedPwd, setShowConfirmedPwd] = useState(false);
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const iconStyles: React.CSSProperties = {
        width: "100%",
        height: "100%",
        color: "#505050",
    };
    const [firstPage, setFirstPage] = useState(true);
    const [elems, setElems] = useState({
        firstName: {
            content: document.getElementById("firstName")!,
            error: "",
        },
        lastName: {
            content: document.getElementById("lastName")!,
            error: "",
        },
        phone: {
            content: document.getElementById("phone")!,
            error: "",
        },
        gender: {
            content: document.getElementById("gender")!,
            error: "",
        },
        email: {
            content: document.getElementById("email")!,
            error: "",
        },
        password: {
            content: document.getElementById("password")!,
            error: "",
        },
        confirmedPassword: {
            content: document.getElementById("confirmedPassword")!,
            error: "",
        },
    });
    const [checkFirstErrors, setCheckFirstErrors] = useState(false);
    const [checkSecondErrors, setCheckSecondErrors] = useState(false);

    const checkFirstName = (input: string) => {
        if (!input.length) {
            setElems((prevElems) => ({
                ...prevElems,
                firstName: {
                    ...prevElems.firstName,
                    error: "should not be empty",
                },
            }));
            return false;
        } else {
            setElems((prevElems) => ({
                ...prevElems,
                firstName: {
                    ...prevElems.firstName,
                    error: "",
                },
            }));
        }
        return true;
    };

    const checkLastName = (input: string) => {
        if (!input.length) {
            setElems((prevElems) => ({
                ...prevElems,
                lastName: {
                    ...prevElems.lastName,
                    error: "should not be empty",
                },
            }));
            return false;
        } else {
            setElems((prevElems) => ({
                ...prevElems,
                lastName: {
                    ...prevElems.lastName,
                    error: "",
                },
            }));
        }
        return true;
    };

    const checkPhone = (input: string) => {
        if (!input.length) {
            setElems((prevElems) => ({
                ...prevElems,
                phone: {
                    ...prevElems.phone,
                    error: "should not be empty",
                },
            }));
            return false;
        } else if (!input.match(/^\d{10}$/)) {
            setElems((prevElems) => ({
                ...prevElems,
                phone: {
                    ...prevElems.phone,
                    error: "should be correct format",
                },
            }));
            return false;
        } else {
            setElems((prevElems) => ({
                ...prevElems,
                phone: {
                    ...prevElems.phone,
                    error: "",
                },
            }));
        }
        return true;
    };

    const checkEmail = (input: string) => {
        if (!input.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
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

    const checkPassword = (input: string) => {
        if (
            !input.match(
                /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/
            )
        ) {
            setElems((prevElems) => ({
                ...prevElems,
                password: {
                    ...prevElems.password,
                    error: "must contain at least 8 characters including an uppercase letter, a number, and a special character",
                },
            }));
            return false;
        } else {
            setElems((prevElems) => ({
                ...prevElems,
                password: {
                    ...prevElems.password,
                    error: "",
                },
            }));
        }
        return true;
    };

    const checkConfirmedPassword = (input: string) => {
        if (password !== input) {
            setElems((prevElems) => ({
                ...prevElems,
                confirmedPassword: {
                    ...prevElems.confirmedPassword,
                    error: "mismatched with above",
                },
            }));
            return false;
        } else {
            setElems((prevElems) => ({
                ...prevElems,
                confirmedPassword: {
                    ...prevElems.confirmedPassword,
                    error: "",
                },
            }));
        }
        return true;
    };

    const checkFirstForm = () => {
        let isValid = true;
        if (!checkFirstName(firstName)) {
            isValid = false;
        }
        if (!checkLastName(lastName)) {
            isValid = false;
        }
        if (!checkPhone(phone)) {
            isValid = false;
        }
        if (!checkFirstErrors) {
            setCheckFirstErrors(true);
        }
        return isValid;
    };

    const checkSecondForm = () => {
        let isValid = true;
        if (!checkEmail(email)) {
            isValid = false;
        }
        if (!checkPassword(password)) {
            isValid = false;
        }
        if (!checkConfirmedPassword(confirmedPassword)) {
            isValid = false;
        }
        if (!isValid) {
            setCheckSecondErrors(true);
        }
        return isValid;
    };
    const handleNext = () => {
        try {
            if (!checkFirstForm()) {
                throw new Error("invalid form");
            }
            setFirstPage(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async () => {
        try {
            if (!checkSecondForm()) {
                throw new Error("invalid form");
            }
            const response = await axios.post(
                "http://localhost:8080/auth/register",
                {
                    firstname: firstName,
                    lastname: lastName,
                    phone: phone,
                    email: email,
                    password: password,
                }
            );
            if (response.status === StatusCodes.CREATED) {
                navigate("/areas");
            } else {
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
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
                            <div className="form__header--title">Sign up</div>
                        </div>
                        {firstPage ? (
                            <div id="formFirst" className="form__body">
                                <div className="form__body__input">
                                    <label className="form__body__input--label">
                                        first name
                                        <span className="required">
                                            {" "}
                                            * {elems.firstName.error}
                                        </span>
                                    </label>
                                    <div className="form__body__input--box">
                                        <input
                                            className="login_input"
                                            type="text"
                                            name="firstName"
                                            // placeholder="example@gmail.com"
                                            maxLength={999}
                                            value={firstName}
                                            onChange={(event) => {
                                                setFirstName(
                                                    event?.target?.value
                                                );
                                                if (checkFirstErrors) {
                                                    checkFirstName(
                                                        event?.target?.value
                                                    );
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="form__body__input">
                                    <label className="form__body__input--label">
                                        last name
                                        <span className="required">
                                            {" "}
                                            * {elems.lastName.error}
                                        </span>
                                    </label>
                                    <div className="form__body__input--box">
                                        <input
                                            className="login_input"
                                            id="lastName"
                                            type="text"
                                            name="lastName"
                                            // placeholder="example@gmail.com"
                                            maxLength={999}
                                            value={lastName}
                                            onChange={(event) => {
                                                setLastName(
                                                    event?.target?.value
                                                );
                                                if (checkFirstErrors) {
                                                    checkLastName(
                                                        event?.target?.value
                                                    );
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="form__body__input">
                                    <label className="form__body__input--label">
                                        phone number
                                        <span className="required">
                                            {" "}
                                            * {elems.phone.error}
                                        </span>
                                    </label>
                                    <div className="form__body__input--box">
                                        <input
                                            className="login_input"
                                            id="phone"
                                            type="text"
                                            name="phone"
                                            maxLength={999}
                                            value={phone}
                                            onChange={(event) => {
                                                setPhone(event?.target?.value);
                                                if (checkFirstErrors) {
                                                    checkPhone(
                                                        event?.target?.value
                                                    );
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <button onClick={handleNext}>Next</button>
                            </div>
                        ) : (
                            <div id="formSecond" className="form__body">
                                <div className="form__body__input">
                                    <label className="form__body__input--label">
                                        e-mail
                                        <span className="required">
                                            {" "}
                                            * {elems.email.error}
                                        </span>
                                    </label>
                                    <div className="form__body__input--box">
                                        <input
                                            className="login_input"
                                            id="email"
                                            type="email"
                                            name="email"
                                            // placeholder="example@gmail.com"
                                            maxLength={999}
                                            value={email}
                                            onChange={(event) => {
                                                setEmail(event?.target?.value);
                                                if (checkSecondErrors) {
                                                    checkEmail(
                                                        event?.target?.value
                                                    );
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="form__body__input">
                                    <label className="form__body__input--label">
                                        password
                                        <span className="required">
                                            {" "}
                                            * {elems.password.error}
                                        </span>
                                    </label>
                                    <div className="form__body__input--box">
                                        <input
                                            className="login_input"
                                            id="password"
                                            type={
                                                !showPwd ? "password" : "text"
                                            }
                                            name="password"
                                            maxLength={999}
                                            value={password}
                                            onChange={(event) => {
                                                setPassword(
                                                    event?.target?.value
                                                );
                                                if (checkSecondErrors) {
                                                    checkPassword(
                                                        event?.target?.value
                                                    );
                                                }
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
                                <div className="form__body__input">
                                    <label className="form__body__input--label">
                                        confirm password
                                        <span className="required">
                                            {" "}
                                            * {elems.confirmedPassword.error}
                                        </span>
                                    </label>
                                    <div className="form__body__input--box">
                                        <input
                                            className="login_input"
                                            id="confirmedPassword"
                                            type={
                                                !showConfirmedPwd
                                                    ? "password"
                                                    : "text"
                                            }
                                            name="confirmedPassword"
                                            maxLength={999}
                                            value={confirmedPassword}
                                            onChange={(event) => {
                                                setConfirmedPassword(
                                                    event?.target?.value
                                                );
                                                if (checkSecondErrors) {
                                                    checkConfirmedPassword(
                                                        event?.target?.value
                                                    );
                                                }
                                            }}
                                        />
                                        <div
                                            className="form__body__input--icon"
                                            onClick={() =>
                                                setShowConfirmedPwd(
                                                    !showConfirmedPwd
                                                )
                                            }
                                        >
                                            {!showConfirmedPwd ? (
                                                <BiShow style={iconStyles} />
                                            ) : (
                                                <BiHide style={iconStyles} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 10 }}>
                                    <button onClick={() => setFirstPage(true)}>
                                        Back
                                    </button>
                                    <button onClick={handleSubmit}>
                                        Submit
                                    </button>
                                </div>
                            </div>
                        )}
                        <div style={{ marginTop: 20 }}>
                            <div className="form__body--span">
                                <span>Already have an account ?</span>{" "}
                                <a className="clickable" href={"/login"}>
                                    Sign in
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    );
};

export default Register;
