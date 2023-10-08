import React, { ReactElement } from "react";

interface CardListProps {
  children: ReactElement[];
}

/**
 * A CardList component is a responsive list of cards that wraps all the cards
 * contained within
 */
const CardList = ({ children }: CardListProps) => {
  return (
    <div className="flex flex-wrap pt-3">
      {children.map((card) => {
        return <div className="pr-5 pb-5">{card}</div>;
      })}
    </div>
  );
};

export default CardList;
