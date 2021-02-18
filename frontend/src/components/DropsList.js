import React from "react";
import DropItem from "./DropItem";

function formatDate(timestamp) {
  const parsedDate = Date.parse(timestamp);
  console.log(parsedDate.toString());
}

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
        />
      ))}
    </div>
  );
}

export default DropsList;
