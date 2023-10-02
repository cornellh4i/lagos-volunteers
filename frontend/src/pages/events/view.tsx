import React from "react";
import ViewEvents from "../../components/organisms/ViewEvents";
import DefaultTemplate from "../../components/templates/DefaultTemplate";
import CustomModal from "../../components/molecules/Modal";
import BoxText from "../../components/atoms/BoxText";

/** A ViewEventsPage page */
const ViewEventsPage = () => {
	return (
		<DefaultTemplate>
			<ViewEvents />
		</DefaultTemplate>
	);
};

export default ViewEventsPage;
