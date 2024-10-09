import React, { useState, useRef } from "react";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { SectionIdEnum } from "../../types";
import "./navigation.css";
import { useNavigate } from "react-router-dom";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

const NavItems = [
  {
    text: "Home",
    to: SectionIdEnum.home,
  },
  {
    text: "Service",
    to: SectionIdEnum.service,
  },
  {
    text: "About us",
    to: SectionIdEnum.about,
  },
];

function Navigation({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  const navigate = useNavigate()
  const navMenuRef = useRef(null);

  const toggleMenu = () => {
    if (isOpen) {
      gsap.to(navMenuRef.current, {
        x: "100%",
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
    setIsOpen(!isOpen);
  };

  const mappedItems = NavItems.map(({ to, text }) => {
    return (
      <AnchorLink
        key={text}
        href={`#${to}`}
        offset="70px"
        className="navbar_button_text"
        onClick={(isOpen) => {
          if (isOpen) {
            setIsOpen(false);
          }
        }}
      >
        {text}
      </AnchorLink>
    );
  });

  return (
    <>
      <div className="responsive_navbar">
        {mappedItems}
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
      <button onClick={toggleMenu} className="button_nav">
        <AiOutlineMenu />
      </button>
      <div
        ref={navMenuRef}
        className={`responsive_navbar_hidden`}
        style={{ display: isOpen ? "block" : "none" }}
      >
        <div className="responsive_navbar_container">
          <AiOutlineClose onClick={toggleMenu} className="close_button_nav" />
        </div>
        <div className="responsive_navbar_list">{mappedItems}</div>
      </div>
    </>
  );
}

export default Navigation;
