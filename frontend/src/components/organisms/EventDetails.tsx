import React from "react";
import IconText from "../atoms/IconText";
import Chip from "../atoms/Chip";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";

interface EventDetailsProps {
	location: string;
	datetime: string;
	supervisors: string[];
	capacity: number;
	image_src: string;
	tags?: string[];
}

/**
 * An EventDetails component is a two-column component, with an event image on
 * the left and key event details on the right
 */
const EventDetails = ({
	location,
	datetime,
	supervisors,
	capacity,
	image_src,
	tags,
}: EventDetailsProps) => {
	var supervisor = supervisors.toString().replace(",", ", ");
	return (
		<div>
			<div className="grid grid-cols-2 gap-4">
				<div className="col-span-2 md:col-span-1">
					<img src={image_src} className="object-cover h-56 w-full" />
				</div>
				<div className="col-span-2 md:col-span-1">
					<div className="text-lg font-semibold mb-4 mt-4 md:mt-0">
						Event Details
					</div>
					<div className="space-y-0.5 mb-4">
						<IconText icon={<LocationOnIcon className="text-gray-400" />}>
							LOCATION ({location})
						</IconText>
						<IconText icon={<CalendarMonthIcon className="text-gray-400" />}>
							{datetime}
						</IconText>
						<IconText icon={<PersonIcon className="text-gray-400" />}>
							Supervisor: {supervisor}
						</IconText>
						<IconText icon={<PersonIcon className="text-gray-400" />}>
							Event Capacity: {capacity.toString()}
						</IconText>
					</div>
					<div className="flex space-x-2">
						{tags?.map((tag) => {
							return <Chip label={tag} color="default" />;
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventDetails;
