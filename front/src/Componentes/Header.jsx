import React from "react";

const Header = () => {
  return (
    <header
      className="bg-primary text-white p-3"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000, // Asegura que el header se mantenga por encima de otros elementos
      }}
    >
      <h1 className="text-center">Auto Market</h1>
    </header>
  );
};

export default Header;
