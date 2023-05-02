import React from "react";
import EventCard from "@/components/molecules/EventCard"; 

type CardListProps = {
  cards: React.ReactElement[];
};

/**
 * A CardList component is a responsive list of cards that wraps all the cards
 * contained within
 */
const CardList = ({ cards }: CardListProps) => {
  return <>
  <div className="flex flex-col gap-4 h-screen items-center justify-center">
    cards
  </div>
  </>;
};

export default CardList;
