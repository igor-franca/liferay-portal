import ClayButton from '@clayui/button';
import {useState} from 'react';

import {CustomerGateModal} from '../../components/CustomerGateModal/CustomerGateModal';
import {GetAppModal} from '../../components/GetAppModal/GetAppModal';
import {Liferay} from '../../liferay/liferay';

interface GetAppPageProps {
	userCustomerChecker: boolean;
}

export default function GetAppPage({userCustomerChecker}: GetAppPageProps) {
	const {origin} = window.location;
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<ClayButton onClick={() => {
					Liferay.ThemeDisplay.isSignedIn() ?
					setShowModal(true) : window.location.href=`${origin}/c/portal/login`;
				}}
			>
				Get App
			</ClayButton>
			{userCustomerChecker &&
			showModal ? (
				<GetAppModal handleClose={() => setShowModal(false)} />
			) : (
				showModal && (
					<CustomerGateModal
						handleClose={() => setShowModal(false)}
					/>
				)
			)}
		</>
	);
}
