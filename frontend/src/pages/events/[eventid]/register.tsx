import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import EventRegisterForm from "@/components/organisms/EventRegisterForm";
import EventConfirmation from "@/components/organisms/EventConfirmation";
import { BASE_URL } from "@/utils/constants";
import { auth } from "@/utils/firebase";
import { useAuth } from "@/utils/AuthContext";
import { fetchUserIdFromDatabase } from "@/utils/helpers";

type eventData = {
	eventid: string;
	location: string;
	datetime: string;
	supervisors: string[];
	capacity: number;
	image_src: string;
	tags: string[] | undefined;
};

function formatDateTimeRange(startDateString: string, endDateString: string) {
	const startDate = new Date(startDateString);
	const endDate = new Date(endDateString);

	const startDateFormatted = `${
		startDate.getUTCMonth() + 1
	}/${startDate.getUTCDate()}/${startDate.getUTCFullYear()}`;
	const startTimeFormatted = formatUTCTime(startDate);
	const endTimeFormatted = formatUTCTime(endDate);

	const formattedDateTimeRange = `${startDateFormatted}, ${startTimeFormatted} - ${endTimeFormatted}`;

	return formattedDateTimeRange;
}

function formatUTCTime(date: Date) {
	const hours = date.getUTCHours();
	const minutes = date.getUTCMinutes();

	const period = hours < 12 ? "AM" : "PM";
	const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
	const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

	return `${formattedHours}:${formattedMinutes} ${period}`;
}

/** An EventRegistration page */
const EventRegistration = () => {
	const router = useRouter();
	const { eventid } = router.query;
	const [eventDetails, setEventDetails] = useState<eventData | null>(null);
	const [attendees, setAttendees] = useState<any[]>([]);
	const [isRegistered, setIsRegistered] = useState<boolean>(false);

	const { user } = useAuth();
	const url = BASE_URL as string;
	useEffect(() => {
		fetchEventDetails();
	}, []);

	const fetchEventDetails = async () => {
		const userToken = await auth.currentUser?.getIdToken();
		try {
			const userId = await fetchUserIdFromDatabase(
				user?.email as string,
				userToken as string
			);
			const fetchUrl = `${url}/users/${userId}/registered?eventid=${eventid}`;
			const response = await fetch(fetchUrl, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${userToken}`,
				},
			});

			const data = await response.json();

			const event = data["data"]["eventDetails"];
			setEventDetails({
				eventid: event["id"],
				location: event["location"],
				datetime: formatDateTimeRange(event["startDate"], event["endDate"]),
				capacity: event["capacity"],
				image_src: event["imageURL"],
				tags: event["tags"],
				supervisors: [
					event["owner"]["profile"]["firstName"] +
						" " +
						event["owner"]["profile"]["lastName"],
				],
			});

			if (
				data["data"]["attendance"] &&
				data["data"]["attendance"]["canceled"]
			) {
				router.push(`/events/${eventid}/cancel`);
			} else if (data["data"]["attendance"]) {
				setIsRegistered(true);
			} else {
				setIsRegistered(false);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<CenteredTemplate>
			{eventDetails ? (
				// If attendees is empty -> return RegisterForm
				!isRegistered ? (
					<EventRegisterForm eventDetails={eventDetails} />
				) : (
					// If attendees is not empty (has 1 entry) -> return RegisterConfirmation
					<EventConfirmation
						eventDetails={eventDetails}
						confirmation="register"
					/>
				)
			) : (
				<div>Getting your data...</div>
			)}
		</CenteredTemplate>
	);
};

export default EventRegistration;