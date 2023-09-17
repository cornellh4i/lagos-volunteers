import React from 'react';

function Loading() {
	return (
		<div className='h-screen bg-white'>
			<div className='flex justify-center items-center h-full'>
				<img
					className='h-16 w-16'
					src='https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif'
					alt=''
				/>
				Authenticating...
			</div>
		</div>
	);
}

export default Loading;
