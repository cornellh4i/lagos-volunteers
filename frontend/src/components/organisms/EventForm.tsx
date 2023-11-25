import React, { useState, useEffect } from "react";
import Link from "next/link";
import Alert from "../atoms/Alert";
import DatePicker from "../atoms/DatePicker";
import TimePicker from "../atoms/TimePicker";
import Upload from "../atoms/Upload";
import MultilineTextField from "../atoms/MultilineTextField";
import Button from "../atoms/Button";
import TextCopy from "../atoms/TextCopy";
import TextField from "../atoms/TextField";
import { useForm, SubmitHandler } from "react-hook-form";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import LocationPicker from "../atoms/LocationPicker";
import { Typography } from "@mui/material";
import { BASE_URL } from "@/utils/constants";
import { auth } from "@/utils/firebase";
import { useAuth } from "@/utils/AuthContext";
import dayjs from "dayjs";
import router from "next/router";
import { fetchUserIdFromDatabase } from "@/utils/helpers";

interface EventFormProps {
	eventId?: string | string[] | undefined;
	eventType: string; //"create" | "edit"
	eventDetails?: FormValues;
}

type FormValues = {
	eventName: string;
	location: string;
	volunteerSignUpCap: string;
	eventDescription: string;
	eventImage: string;
	rsvpLinkImage: string;
	startDate: string;
	endDate: string;
	startTime: string;
	endTime: string;
	mode: string;
};

/** Helper function for converting datepicker and timepicker to ISO string*/
const convertToISO = (inputTime: string, inputDate: string) => {
	console.log(inputTime);
	console.log(inputDate);
	var timeIndex = 0;
	var counter = 0;
	const time = String(inputTime);
	const date = String(inputDate);
	for (let i = 0; i < time.length; i++) {
		if (time[i] === " ") {
			counter += 1;
			if (counter === 4) {
				timeIndex = i;
				counter = 0;
				break;
			}
		}
	}
	var dateIndex = 0;
	for (let i = 0; i < date.length; i++) {
		if (date[i] === " ") {
			counter += 1;
			if (counter === 4) {
				dateIndex = i;
				counter = 0;
				break;
			}
		}
	}
	const rawDateTime = date.substring(0, dateIndex) + time.substring(timeIndex);
	console.log(rawDateTime);
	const res = dayjs(rawDateTime).toJSON();
	return res;
};

/** An EventForm page */
const EventForm = ({ eventId, eventType, eventDetails }: EventFormProps) => {
	const { user } = useAuth();
	const url = BASE_URL as string;
	const [isLoading, setIsLoading] = useState(false);
	// For deciding whether to show "In-person" or "Virtual"
	// 0: no show, 1: show yes.
	const [status, setStatus] = React.useState(
		eventDetails ? (eventDetails.mode === "IN_PERSON" ? 1 : 0) : 0
	);

	const [getStartDate, setStartDate] = React.useState(
		eventDetails ? String(dayjs(eventDetails.startDate)) : ""
	);
	const [getEndDate, setEndDate] = React.useState(
		eventDetails ? String(dayjs(eventDetails.endDate)) : ""
	);
	const [getStartTime, setStartTime] = React.useState(
		eventDetails ? String(dayjs(eventDetails.startTime)) : ""
	);
	const [getEndTime, setEndTime] = React.useState(
		eventDetails ? String(dayjs(eventDetails.endTime)) : ""
	);
	const radioHandler = (status: number) => {
		setStatus(status);
	};

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormValues>(
		eventDetails
			? {
					defaultValues: {
						eventName: eventDetails.eventName,
						location: eventDetails.location,
						volunteerSignUpCap: eventDetails.volunteerSignUpCap,
						eventDescription: eventDetails.eventDescription,
						eventImage: eventDetails.eventImage,
						rsvpLinkImage: eventDetails.rsvpLinkImage,
					},
			  }
			: {}
	);
	const back = () => {
		router.replace("/events/view");
		setIsLoading(false);
	};

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const CreateErrorComponent = (): JSX.Element | null => {
		return errorMessage ? (
			<Alert severity="error">Error: {errorMessage}</Alert>
		) : null;
	};

	const CreateSuccessComponent = (): JSX.Element | null => {
		return successMessage ? (
			<Alert severity="success">Success: {successMessage}</Alert>
		) : null;
	};

	const timeAndDateValidation = () => {
		if (getStartTime == "") {
			setErrorMessage("Start Time is required.");
			return false;
		}
		if (getEndTime == "") {
			setErrorMessage("End Time is required.");
			return false;
		}
		if (getStartDate == "") {
			setErrorMessage("Start Date is required.");
			return false;
		}
		if (getEndDate == "") {
			setErrorMessage("End Date is required.");
			return false;
		}

		const startDateTime = convertToISO(getStartTime, getStartDate);
		const endDateTime = convertToISO(getEndTime, getEndDate);
		if (new Date(startDateTime) >= new Date(endDateTime)) {
			setErrorMessage(
				"End Date and Time must be later than Start Date and Time"
			);
			return false;
		} else {
			setErrorMessage(null);
		}
		return true;
	};

	/**Helper for handling creating events */
	const handleCreateEvent: SubmitHandler<FormValues> = async (data) => {
		setIsLoading(true);
		const validation = timeAndDateValidation();
		if (!validation) {
			setIsLoading(false);
			return;
		}
		const userToken = await auth.currentUser?.getIdToken();
		const mode = status === 0 ? "VIRTUAL" : "IN_PERSON";
		const startDateTime = convertToISO(getStartTime, getStartDate);
		const endDateTime = convertToISO(getEndTime, getEndDate);
		const { eventName, location, volunteerSignUpCap, eventDescription } = data;
		const userid = await fetchUserIdFromDatabase(
			user?.email as string,
			userToken as string
		);
		const fetchCreateEventsUrl = `${url}/events`;
		try {
			const createBody = {
				userID: `${userid}`,
				event: {
					name: `${eventName}`,
					location: `${location}`,
					description: `${eventDescription}`,
					startDate: new Date(`${startDateTime}`),
					endDate: new Date(`${endDateTime}`),
					capacity: +volunteerSignUpCap,
					mode: `${mode}`,
				},
			};

			const response = await fetch(fetchCreateEventsUrl, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${userToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(createBody),
			});
			const r = await response.json();

			if (response.ok) {
				setSuccessMessage("Successfully Created Event! Redirecting...");
				setTimeout(back, 7000);
			} else {
				setErrorMessage(
					"We were unable to create this event. Please try again."
				);
			}
			setIsLoading(false);
		} catch (error: any) {
			setErrorMessage("Network Error");
			setIsLoading(false);
		}
	};

	/**Helper for handling editing events */
	const handleEditEvent: SubmitHandler<FormValues> = async (data) => {
		setIsLoading(true);
		const validation = timeAndDateValidation();
		if (!validation) {
			setIsLoading(false);
			return;
		}

		const mode = status === 0 ? "VIRTUAL" : "IN_PERSON";
		const startDateTime = convertToISO(getStartTime, getStartDate);
		const endDateTime = convertToISO(getEndTime, getEndDate);
		const { eventName, location, volunteerSignUpCap, eventDescription } = data;
		const fetchEditEventsUrl = `${url}/events/${eventId}`;

		try {
			const editBody = {
				name: `${eventName}`,
				location: `${location}`,
				description: `${eventDescription}`,
				startDate: `${startDateTime}`,
				endDate: `${endDateTime}`,
				capacity: +volunteerSignUpCap,
				mode: `${mode}`,
			};
			const userToken = await auth.currentUser?.getIdToken();
			const response = await fetch(fetchEditEventsUrl, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${userToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(editBody),
			});

			const r = await response.json();

			if (response.ok) {
				setSuccessMessage("Successfully Edited Event! Redirecting...");
				setTimeout(back, 3000);
			} else {
				setErrorMessage("Unable to edit event. Please try again");
			}
			setIsLoading(false);
		} catch (error: any) {
			setErrorMessage("Network error");
			setIsLoading(false);
		}
	};

	return (
		<form
			onSubmit={
				eventType == "create"
					? handleSubmit(handleCreateEvent)
					: handleSubmit(handleEditEvent)
			}
			className="space-y-4">
			<CreateErrorComponent />
			<CreateSuccessComponent />
			<div className="font-bold text-3xl">
				{eventType == "create" ? "Create Event" : "Edit Event"}
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2  col-span-2  sm:col-span-1">
				<TextField
					label="Event Name"
					required={true}
					name="eventName"
					register={register}
					requiredMessage={errors.eventName ? "Required" : undefined}
				/>
			</div>
			<div className="sm:space-x-4 grid grid-cols-1 sm:grid-cols-2">
				<div className="pb-4 sm:pb-0">
					<DatePicker
						label="Start Date"
						value={eventDetails ? eventDetails.startDate : undefined}
						onChange={(e) =>
							e?.$d != "Invalid Date" ? setStartDate(e.$d) : ""
						}
					/>
				</div>
				<DatePicker
					label="End Date"
					value={eventDetails ? eventDetails.endDate : undefined}
					onChange={(e) => (e?.$d != "Invalid Date" ? setEndDate(e.$d) : "")}
				/>
			</div>
			<div className="sm:space-x-4 grid grid-cols-1 sm:grid-cols-2">
				<div className="pb-4 sm:pb-0">
					<TimePicker
						label="Start Time"
						value={eventDetails ? eventDetails.startTime : undefined}
						onChange={(e) =>
							e?.$d != "Invalid Date" ? setStartTime(e.$d) : ""
						}
					/>
				</div>
				<TimePicker
					label="End Time"
					value={eventDetails ? eventDetails.endTime : undefined}
					onChange={(e) => (e?.$d != "Invalid Date" ? setEndTime(e.$d) : "")}
				/>
			</div>
			<div>
				<FormControl>
					<div>Location</div>
					<RadioGroup
						row
						aria-labelledby="demo-row-radio-buttons-group-label"
						name="row-radio-buttons-group"
						defaultValue={eventDetails ? eventDetails.mode : "VIRTUAL"}
						sx={{ borderRadius: 2, borderColor: "primary.main" }}>
						<FormControlLabel
							value="VIRTUAL"
							control={<Radio />}
							label={<Typography sx={{ fontSize: 15 }}>Virtual</Typography>}
							onClick={() => radioHandler(0)}
						/>
						<FormControlLabel
							value="IN_PERSON"
							control={<Radio />}
							label={<Typography sx={{ fontSize: 15 }}>In-Person</Typography>}
							onClick={() => radioHandler(1)}
						/>
					</RadioGroup>
				</FormControl>
				{status == 1 && (
					<LocationPicker
						label=""
						required={status == 1}
						name="location"
						register={register}
						requiredMessage={errors.location ? "Required" : undefined}
					/>
				)}
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 col-span-2  sm:col-span-1">
				<TextField
					label="Volunteer Sign Up Cap"
					required={true}
					type="number"
					name="volunteerSignUpCap"
					register={register}
					requiredMessage={errors.volunteerSignUpCap ? "Required" : undefined}
				/>
			</div>
			<MultilineTextField
				label="Event Description"
				required={true}
				name="eventDescription"
				register={register}
				requiredMessage={errors.eventDescription ? "Required" : undefined}
			/>
			<Upload label="Event Image" />
			<TextCopy
				label="RSVP Link Image"
				text={
					eventType == "edit"
						? `www.lagos/event/${eventId}/register`
						: `www.lagos/event/register`
				}
			/>
			<div>
				{eventType == "create" ? (
					<div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
						<div className="col-start-1 col-span-1 sm:col-start-3 sm:col-span-1">
							<Link href="/events/view">
								<Button color="gray">Cancel</Button>
							</Link>
						</div>
						<div className="col-start-1 col-span-1 sm:col-start-4 sm:col-span-1">
							<Button isLoading={isLoading} type="submit" color="dark-gray">
								Create
							</Button>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
						<div className="sm:col-start-4 sm:col-span-3">
							<Link href="/events/view">
								<Button color="gray">Cancel</Button>
							</Link>
						</div>
						<div className="sm:col-start-7 sm:col-span-3">
							<Button color="gray">Cancel Event</Button>
						</div>
						<div className="sm:col-start-10 sm:col-span-3">
							<Button type="submit" color="dark-gray" isLoading={isLoading}>
								Save Changes
							</Button>
						</div>
					</div>
				)}
			</div>
		</form>
	);
};

export default EventForm;
