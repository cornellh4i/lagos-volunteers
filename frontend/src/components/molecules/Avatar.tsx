import React from "react";

/** default royalty free avatar image */
export const FALLBACK_AVATAR_URL =
	"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
export const FALLBACK_AVATOR_ALT = "avatar";

/** both the image url and alt text are optional */
interface AvatarProps {
	url?: string;
	alt?: string;
	name: string | undefined;
	start_date: Date;
	hour: number;
}

const Avatar = ({
	url = FALLBACK_AVATAR_URL,
	alt = FALLBACK_AVATOR_ALT,
	name,
	start_date,
	hour,
}: AvatarProps) => {
	return (
		<>
			<div className="sm:flex">
				<div className="flex justify-center">
					<img
						src={url || FALLBACK_AVATAR_URL}
						alt={alt}
						className="rounded-full w-32"
					/>
				</div>
				<div className="p-6 font-sans text-center sm:text-left">
					<div className="text-3xl font-semibold">{name}</div>
					<div className="py-1">
						Volunteer since {start_date.toLocaleDateString("en-US")}
					</div>
					<div>{hour} volunteer hours completed</div>
				</div>
			</div>
		</>
	);
};

export default Avatar;
