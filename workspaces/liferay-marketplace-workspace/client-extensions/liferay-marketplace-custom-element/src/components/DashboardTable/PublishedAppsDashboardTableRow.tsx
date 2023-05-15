import ClayTable from '@clayui/table';
import classNames from 'classnames';

import appPlaceholder from '../../assets/images/app_placeholder.png';
import circleFill from '../../assets/icons/circle_fill_icon.svg';
import {showAppImage} from '../../utils/util';
import {AppProps} from './DashboardTable';

import './PublishedAppsDashboardTableRow.scss';

interface PublishedAppsDashboardTableRowProps {
	item: AppProps;
}

export function PublishedAppsDashboardTableRow({
	item,
}: PublishedAppsDashboardTableRowProps) {
	const {
		attachments,
		lastUpdatedBy,
		name,
		status,
		type,
		updatedDate,
		version,
	} = item;

	const appLogo = attachments.find(({customFields}) =>
		customFields?.find(
			({
				name,
				customValue: {
					data: [value],
				},
			}) => name === 'App Icon' && value === 'Yes'
		)
	);

	return (
		<ClayTable.Row>
			<ClayTable.Cell>
				<div className="dashboard-table-row-name-container">
					<img
						alt="App Image"
						className="dashboard-table-row-name-logo"
						src={showAppImage(
							appLogo ? appLogo.src : appPlaceholder
						)}
					/>

					<span className="dashboard-table-row-name-text">
						{name}
					</span>
				</div>
			</ClayTable.Cell>

			<ClayTable.Cell>
				<span className="dashboard-table-row-text">{version}</span>
			</ClayTable.Cell>

			<ClayTable.Cell>
				<span className="dashboard-table-row-text">{type}</span>
			</ClayTable.Cell>

			<ClayTable.Cell>
				<div className="dashboard-table-row-last-updated-container">
					<span className="dashboard-table-row-last-updated-date">
						{updatedDate}
					</span>
				</div>

				<span className="dashboard-table-row-last-updated-by">
					{lastUpdatedBy}
				</span>
			</ClayTable.Cell>

			<ClayTable.Cell>
				<div className="dashboard-table-row-status-container">
					<img
						alt="Circle Fill"
						className={classNames(
							'dashboard-table-row-status-icon',
							{
								'dashboard-table-row-status-icon-hidden':
									status === 'Hidden',
								'dashboard-table-row-status-icon-pending':
									status === 'Pending',
								'dashboard-table-row-status-icon-published':
									status === 'Published',
							}
						)}
						src={circleFill}
					/>

					<span className="dashboard-table-row-published-text">
						{status}
					</span>
				</div>
			</ClayTable.Cell>
		</ClayTable.Row>
	);
}
