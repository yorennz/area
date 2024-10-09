import { ReactNode } from "react"; // Importez ReactNode depuis React
import "./Background.css";

const Background = ({ children }: { children: ReactNode }) => {
  return (
    <div className="screen">
      <div
        className="ellipse3"
        style={{ backgroundColor: "var(--purple-bg-color2)" }}
      />
      <div
        className="ellipse1"
        style={{ backgroundColor: "var(--purple-bg-color)" }}
      />
      <div
        className="ellipse4"
        style={{ backgroundColor: "var(--purple-bg-color3)" }}
      />
      <div
        className="ellipse5"
        style={{ backgroundColor: "var(--white-bg-color2)" }}
      />
      <div
        className="ellipse6"
        style={{ backgroundColor: "var(--purple-bg-color3)" }}
      />
      {children}
    </div>
  );
};

export default Background ;
