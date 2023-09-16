import React, { ReactNode, useEffect } from 'react';
import NavBar from '@/components/organisms/NavBar';
import { useRouter } from 'next/router';
import { useAuth } from '@/utils/AuthContext';

/** A WelcomeTemplate page */
interface WelcomeTemplateProps {
	children: ReactNode;
}

const WelcomeTemplate = ({ children }: WelcomeTemplateProps) => {
	const { user, loading, isAuthenticated } = useAuth();
	const router = useRouter();

	// If you are already logged in, redirect to the home page
	useEffect(() => {
		if (user && isAuthenticated) {
			router.replace('/events/view');
		}
	}, [user, loading]);

	if (loading || user) {
		return <div>Loading...</div>;
	}

	return (
		<div className='flex flex-col min-h-screen'>
			<NavBar />
			<div className='flex grow'>
				<div className='flex w-full sm:max-w-md items-center justify-center py-10 px-10 sm:px-20'>
					<div className='w-full'>{children}</div>
				</div>
				<div className='flex-1 bg-gray-300'></div>
			</div>
		</div>
	);
};

export default WelcomeTemplate;
