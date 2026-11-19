/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import {ClayDropDownWithItems} from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';
import {
	FrontendDataSetContext,
	IItemsActions,
} from '@liferay/frontend-data-set-web';
import {sub} from 'frontend-js-web';
import React, {useContext} from 'react';

import getTaskItemsActions from '../../../../../utils/getTaskItemsActions';
import {ITaskItemsActionsTask} from '../../../../../utils/types';
import {TreeTask} from '../types';

export default function TaskActionsDropdown({
	itemsActions,
	onTaskChange,
	treeTask,
}: {
	itemsActions: IItemsActions[];
	onTaskChange: (task: ITaskItemsActionsTask) => void;
	treeTask: TreeTask;
}) {
	const {loadData} = useContext(FrontendDataSetContext);

	return (
		<ClayDropDownWithItems
			items={getTaskItemsActions(
				itemsActions,
				loadData,
				treeTask,
				onTaskChange
			)}
			trigger={
				<ClayButton
					aria-label={sub(
						Liferay.Language.get('actions-for-x'),
						treeTask.embedded.title
					)}
					displayType="unstyled"
					monospaced
					size="sm"
				>
					<ClayIcon symbol="ellipsis-v" />
				</ClayButton>
			}
		/>
	);
}
