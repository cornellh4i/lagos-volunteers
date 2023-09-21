import React, { ReactElement, Children } from "react";

interface CardListProps {
  children: ReactElement[];
}

/**
 * A CardList component is a responsive list of cards that wraps all the cards
 * contained within
 */
const CardList = ({ children }: CardListProps) => {
  return (
    <>
      <div className="flex space-x-6 p-3">{children}</div>
    </>
  );
};

export default CardList;
