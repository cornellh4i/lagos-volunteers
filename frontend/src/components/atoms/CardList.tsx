import React, { ReactElement, Children } from "react";
import EventCard from "@/components/molecules/EventCard";

type CardListProps = {
  children: ReactElement[];
};

/**
 * A CardList component is a responsive list of cards that wraps all the cards
 * contained within
 */
const CardList = ({ children }: CardListProps) => {
  return (
    <>
      <div className="flex h-screen">{children}</div>
    </>
  );
};

export default CardList;
