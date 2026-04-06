import React from "react";

export default function Modal({ children, onClose }) {
  return (
    <div style={overlay}>
      <div style={modal}>
        <button onClick={onClose} style={{ float: "right" }}>❌</button>
        {children}
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)"
};

const modal = {
  background: "#fff",
  padding: "20px",
  margin: "100px auto",
  width: "300px",
  borderRadius: "8px"
};
