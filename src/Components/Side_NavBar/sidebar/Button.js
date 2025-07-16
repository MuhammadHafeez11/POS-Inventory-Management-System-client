import React, { useState } from "react";
import { Icon } from "./Icon";
import { useRipple } from "./useRipple";

const Button = ({ onClick, name, icon, isActive }) => {
  const [createRipple] = useRipple();

  const handleClick = (e) => {
    createRipple(e, name);
    onClick(name);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={isActive ? "active" : ""}
    >
      <span className="button-content">
        {icon && <Icon icon={icon} />}
        <span>{name}</span>
      </span>
      <span id={`ripple-container-${name}`}></span>
    </button>
  );
};

export { Button };
