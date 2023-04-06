import { useEffect, useState } from 'react';
import {AppCreationFlow} from './pages/AppCreationFlow/AppCreationFlow';
import GetAppPage from './pages/GetAppPage/GetAppPage';
import {PublishedAppsDashboardPage} from './pages/PublishedAppsDashboardPage/PublishedAppsDashboardPage';
import {PurchasedAppsDashboardPage} from './pages/PurchasedAppsDashboardPage/PurchasedAppsDashboardPage';
import { publisherUserChecker } from './utils/util';

interface AppRoutesProps {
	route: string;
}
export default function AppRoutes({route}: AppRoutesProps) {
	const [userChecker, setUserChecker] = useState(false);

	useEffect(() => {
		const makePublisherUserChecker = async () => {
			setUserChecker(await publisherUserChecker());
		}
		makePublisherUserChecker();
	}, [])

	if (route === 'create-new-app') {
		return <AppCreationFlow />;
	}
	else if (route === 'purchased-apps-dashboard') {
		if(userChecker){
			return <PurchasedAppsDashboardPage />;
		}
	}
	else if (route === 'get-app') {
		return <GetAppPage />;
	}

	return <PublishedAppsDashboardPage />;
}
