import React from "react";
import ViewEvents from "../../components/organisms/ViewEvents";
import DefaultTemplate from "../../components/templates/DefaultTemplate";
import CustomModal from "../../components/molecules/Modal";
import BoxText from "../../components/atoms/BoxText";

/** A ViewEventsPage page */
const ViewEventsPage = () => {
  return (
    <DefaultTemplate>
      <CustomModal open = {true} header={"hello"} bodyText={"hi"} buttonText={"toodaloo"} buttonText2={"teehee"}
        />
      <ViewEvents />
    </DefaultTemplate>
  );
};

export default ViewEventsPage;
