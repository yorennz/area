import React, { useState } from "react";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { SectionIdEnum } from "../../types";
import Navigation from "./navigation";
import Logo from "../../../assets/logo_nobg.png";
import "./main-layout.css";
import "./navigation.css";

function MainLayout({ children }: { children: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="navbar_bg">
      <div className="navbar_container">
        <AnchorLink href={`#${SectionIdEnum.home}`} offset="70px">
          <img src={Logo} alt="logo" className="logo" />
        </AnchorLink>
        <Navigation isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <div>
        <main>{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;
