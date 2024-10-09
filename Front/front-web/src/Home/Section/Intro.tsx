import "./Intro.css";
import Background from "../../Component/Background";
import React, { useEffect } from "react";
import { gsap } from "gsap";
import SplitText from "gsap-trial/SplitText";
import { useNavigate } from "react-router-dom";

function AnimateTitle() {
  useEffect(() => {
    const titles = gsap.utils.toArray("h1") as HTMLElement[];
    const tl = gsap.timeline({ repeat: -1 });

    titles.forEach((title) => {
      const splitTitle = new SplitText(title);

      tl.from(
        splitTitle.chars,
        {
          opacity: 0,
          y: 80,
          rotateX: -90,
          stagger: 0.02,
        },
        "<"
      ).to(
        splitTitle.chars,
        {
          opacity: 0,
          y: -80,
          rotateX: 90,
          stagger: 0.02,
        },
        "<1"
      );
    });
  }, []);

  return (
    <div className="header_title">
      <h1>Area</h1>
      <h1>Action</h1>
      <h1>Reaction</h1>
    </div>
  );
}

export default function Intro() {
  const navigate = useNavigate();

  const dashboardButton = () => {
    navigate("/areas");
  };

  return (
    <>
      <div className="home_container">
        <div className="home_header">
          <Background>
            <div style={{padding: "15px"}} />
            <span
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                marginTop: "15vh",
              }}
            >
              <AnimateTitle />
              <button className="intro_button" onClick={dashboardButton}>
                Get Started
              </button>
            </span>
          </Background>
        </div>
      </div>
    </>
  );
}
