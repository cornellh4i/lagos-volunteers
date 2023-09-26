import React from "react";

function Loading() {
	return (
		<div className="h-screen bg-white">
			<div className="flex justify-center items-center h-full">
				<img
					className="h-8 w-8"
					src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif"
					alt=""
				/>
			</div>
		</div>
	);
}

export default Loading;
