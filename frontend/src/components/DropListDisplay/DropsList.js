import React from "react";
import DropItem from "./DropItem";

function DropsList({ drops }) {
  return (
    <div className="code-drops-display">
      {drops.map((drop) => (
        <DropItem
          title={drop.title}
          lastUpdate={drop.updatedAt}
          description={drop.description}
          language={drop.lang}
          id={drop.id}
          hasStar={drop.isStarred}
          starCount={drop.starCount}
          user={drop.user}
        />
      ))}
    </div>
  );
}

export default DropsList;
