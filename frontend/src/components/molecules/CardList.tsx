import React, { ReactNode, Children } from "react";

interface CardListProps {
  children: ReactNode;
}

/**
 * A CardList component is a responsive list of cards that wraps all the cards
 * contained within
 */
const CardList = ({ children }: CardListProps) => {
  const cards = Children.toArray(children);
  return (
    <>
      {/* Show only on large screens */}
      <div className="hidden sm:flex flex-wrap pt-3">
        {cards.map((card, index) => {
          return <div key={index} className="pr-5 pb-5 w-96">{card}</div>;
        })}
      </div>

      {/* Show only on small screens */}
      <div className="sm:hidden flex flex-col pt-3">
        {cards.map((card, index) => {
          return <div key={index} className="pb-4">{card}</div>;
        })}
      </div>
    </>
  );
};

export default CardList;
