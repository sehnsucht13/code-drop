import React from "react";
import DropItem from "./DropItem";

function DropsList({ drops }) {
  return (
    <div id="code-drops-display" className="min-vh-100">
      {drops.map((drop) => (
        <DropItem
          key={drop.id}
          title={drop.title}
          lastUpdate={drop.updatedAt}
          description={drop.description}
          language={drop.lang}
          id={drop.id}
          hasStar={drop.isStarred}
          starCount={drop.starCount}
          user={drop.user}
          forkCount={drop.numForks}
        />
      ))}
    </div>
  );
}

export default DropsList;
