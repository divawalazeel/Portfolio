import React, { useEffect, useState } from "react";
import "./CustomCursor.css";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [circlePosition, setCirclePosition] = useState({ x: 0, y: 0 });
  const [hoverNav, setHoverNav] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({ x: event.pageX, y: event.pageY });

      setTimeout(() => {
        setCirclePosition({ x: event.pageX, y: event.pageY });
      }, 100);
    };

    const handleMouseEnter = () => setHoverNav(true);
    const handleMouseLeave = () => setHoverNav(false);

    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove);
    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach((item) => {
      item.addEventListener("mouseenter", handleMouseEnter);
      item.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      navItems.forEach((item) => {
        item.removeEventListener("mouseenter", handleMouseEnter);
        item.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        className={`cursor-dot ${hoverNav ? "backdrop-invert" : ""}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      ></div>
      <div
        className={`cursor-circle ${hoverNav ? "backdrop-invert" : ""}`}
        style={{
          left: `${circlePosition.x}px`,
          top: `${circlePosition.y}px`,
        }}
      ></div>
    </>
  );
};

export default CustomCursor;
