import React, { useRef, useState } from "react";
import { a, useSpring } from "@react-spring/web";
import Menu from "./Menu";

const MenuButton = () => {
  const [isOpen, open] = useState(false);
  const offset = 10;

  const [dots, dotsApi] = useSpring(() => ({
    from: { transform: `rotate(0deg)` },
  }));

  const handleMouseEnter = () => {
    dotsApi.start({ transform: `rotate(90deg)` });
  };
  const handleMouseLeave = () => {
    if (!isOpen) {
      dotsApi.start({ transform: `rotate(0deg)` });
    }
  };

  const [menu, menuApi] = useSpring(() => ({
    from: { y: offset, opacity: 1 },
  }));

  const [close, closeApi] = useSpring(() => ({
    from: { y: offset, opacity: 0 },
  }));

  const handleClick = () => {
    menuApi.stop();
    closeApi.stop();
      menuApi.start({
        y: !isOpen ? -offset : offset,
        opacity: !isOpen ? 0 : 1,
      });

      closeApi.start({
        y: !isOpen ? -offset : offset,
        opacity: !isOpen ? 1 : 0,
      });
  };

  const ref = useRef();

  // Close the menu and play the dots/menu/close springs back to their
  // resting state. Used both for outside-clicks and when an item inside the
  // menu is activated, so the dropdown disappears as soon as the user has
  // committed to a destination.
  const closeMenu = () => {
    if (!isOpen) return;
    open(false);
    dotsApi.start({ transform: `rotate(0deg)` });
    handleClick();
  };

  const handleWindowClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      closeMenu();
    }
  };

  return (
    <>
      <Menu
        open={isOpen}
        onOutsideClick={handleWindowClick}
        onClose={closeMenu}
      />
      <div
        // Background colors are sourced from theme tokens (bg-brgray ↔
        // bg-bg-alt) so the button visually adapts to light/dark mode
        // without keeping a hardcoded hex in component state.
        className={`nav_btn_lg py-6 flex items-center justify-center cursor-pointer transition-colors duration-200 ${
          isOpen ? "bg-bg-alt" : "bg-brgray hover:bg-bg-alt"
        }`}
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          open(!isOpen);
          handleClick();
        }}
      >
        <div className="flex flex-col h-6 items-center justify-center">
          <a.div style={menu}>MENU&nbsp;&nbsp;</a.div>
          <a.div style={close}>CLOSE&nbsp;&nbsp;</a.div>
        </div>
        <a.div style={dots}>•&nbsp;•</a.div>
      </div>
    </>
  );
};

export default MenuButton;
