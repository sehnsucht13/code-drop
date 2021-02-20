import React from "react";

function SideBar({ username, description }) {
  return (
    <div>
      <p className="h4 text-center">{username}</p>
      <p>{description || "User has not written a description."}</p>
    </div>
  );
}

export default SideBar;
