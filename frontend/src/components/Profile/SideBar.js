import React from "react";

import ProfileDescription from "./ProfileDescription";
import ProfileAvatar from "./ProfileAvatar";

function SideBar({ username, description, avatar, allowEdit, userId }) {
  return (
    <div style={{ height: "100%" }}>
      <ProfileAvatar avatar={avatar} allowEdit={allowEdit} userId={userId} />
      <p className="h4 text-center">{username}</p>
      <ProfileDescription
        allowEdit={allowEdit}
        description={description}
        userId={userId}
      />
    </div>
  );
}

export default SideBar;
