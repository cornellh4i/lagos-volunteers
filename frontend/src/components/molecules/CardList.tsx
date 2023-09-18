import React, { ReactElement, Children } from "react";
//import EventCard from "@/components/molecules/EventCard";

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
      <div className="flex grow space-x-6">{children}</div>
    </>
  );
};

export default CardList;
