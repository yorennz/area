import { useContext, useRef, useState } from "react";
import { LuUser, LuSettings } from "react-icons/lu";
import { FaBars } from "react-icons/fa";
import { MdOutlineClose, MdLogout } from "react-icons/md";
import { AiOutlineAppstoreAdd, AiOutlineClose } from "react-icons/ai";
import { BsShieldCheck } from "react-icons/bs";
import { NavLink, Outlet } from "react-router-dom";
import "./Sidebar.css";
import profile_pictur from "../../assets/profile_picture.jpg";
import { MainContext } from "../../Context/AllContext";
import gsap from "gsap";

const menuItem = [
    {
        path: "/areas",
        name: "Areas",
        icon: <AiOutlineAppstoreAdd />,
    },
    {
        path: "/user",
        name: "User",
        icon: <LuUser />,
    },
    {
        path: "/authorization",
        name: "Authorization",
        icon: <BsShieldCheck />,
    },
];

const Sidebar = () => {
    const context = useContext(MainContext);
    const _user_info: string | null = localStorage.getItem("user");
    const [isOpen, setIsOpen] = useState(true);
    let user_info: { [key: string]: string } = {};
    const [activeMenuItem, setActiveMenuItem] = useState("");
    const [open, setOpen] = useState(false);
    const navMenuRef = useRef(null);

    if (_user_info) {
        user_info = JSON.parse(_user_info);
    }

    const toggleMenu = () => {
        if (open) {
            gsap.to(navMenuRef.current, {
                x: "-100%",
                duration: 0.3,
                ease: "power2.inOut",
            });
        } else {
            gsap.to(navMenuRef.current, {
                x: "0%",
                duration: 0.3,
                ease: "power2.inOut",
            });
        }
        setOpen(!open);
    };

    const mappedItems = (isOpen: boolean) => (
        <div>
            {menuItem.map((item, index) => (
                <NavLink
                    to={item.path}
                    key={index}
                    className={`link ${
                        activeMenuItem === item.path ? "active" : ""
                    }`}
                    onClick={() => {
                        setActiveMenuItem(item.path);
                        toggleMenu();
                    }}
                >
                    <div className="icon">{item.icon}</div>
                    <div
                        style={{ display: isOpen ? "block" : "none" }}
                        className="link_text"
                    >
                        {item.name}
                    </div>
                </NavLink>
            ))}
        </div>
    );

    const footerElement = (isOpen: boolean) =>
        isOpen ? (
            <div className="footer_element">
                <div className="username_text">
                    {user_info.firstname} {user_info.lastname}
                </div>
                <MdLogout
                    onClick={context?.logout}
                    style={{ fontSize: "30px" }}
                />
            </div>
        ) : (
            <MdLogout onClick={context?.logout} className="logout_icon" />
        );

    return (
        <div className="container">
            <div className="responsive">
                <div className="header_responsive">
                    <button className="menu_button" onClick={toggleMenu}>
                        <FaBars />
                    </button>
                    <div className="title">Area</div>
                    <div
                        ref={navMenuRef}
                        className={`modal_container_sidebar`}
                        style={{ display: open ? "block" : "none" }}
                    >
                        <div className="modal_style_sidebar">
                            <AiOutlineClose onClick={toggleMenu} />
                            <div className="modal_container">
                                {mappedItems(isOpen)}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <Outlet />
                </div>
            </div>
            <div style={{ width: isOpen ? "15vw" : "4vw" }} className="sidebar">
                <div>
                    <div className="sidebar_header">
                        <h1
                            style={{
                                display: isOpen ? "block" : "none",
                            }}
                        >
                            Area
                        </h1>
                        <div
                            className="bars"
                            onClick={toggleMenu}
                            style={{ marginLeft: isOpen ? "none" : "14px" }}
                        >
                            {isOpen ? <MdOutlineClose /> : <FaBars />}
                        </div>
                    </div>
                    <div className="header-bar" />
                    {mappedItems(isOpen)}
                </div>
                <div className="footers">
                    <div className="footer_bar" />
                    {footerElement(isOpen)}
                </div>
            </div>
            <div className="dekstop_body">
                <Outlet />
            </div>
        </div>
    );
};

export default Sidebar;
