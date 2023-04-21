import React from 'react';
import ProfileForm from '@/components/molecules/ProfileForm';
import ProfileTemplate from '@/components/templates/ProfileTemplate';

/** A Profile page */
const Profile = () => {
	const date = new Date();
	return (
		<ProfileTemplate
			name='Jason Zheng'
			form={ProfileForm}
			hour={20}
			start_date={date}
		/>
	);
};

export default Profile;
