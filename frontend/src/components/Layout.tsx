import React, { ReactNode, useEffect } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
	return <main>{children}</main>;
};

export default Layout;
