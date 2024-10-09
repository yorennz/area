import React from "react";
import Intro from "../Section/Intro";
import Service from "../Section/Service";
import AboutUs from "../Section/About";
import "./Navbar.css";
import AnchorLink from "react-anchor-link-smooth-scroll";

const Section = [
  {
    name: "Home",
    component: <Intro />,
  },
  {
    name: "Service",
    component: <Service />,
  },
  {
    name: "About us",
    component: <AboutUs />,
  },
];

function Navbar({ children }: { children: any }) {
  const mappedItems = Section.map(({ name, component }) => {
    return (
      <AnchorLink href={`#${component}`} offset={"64px"} className="all_unset">
        <button>{name}</button>
      </AnchorLink>
    );
  });

  return (
    <div>
      <div className="navbar_container">
        <div className="navbar_title">Area</div>
        <div>{mappedItems}</div>
      </div>
      {children}
    </div>
  );
}

export default Navbar;
