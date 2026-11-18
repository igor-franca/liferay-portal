/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayIcon from '@clayui/icon';
import {IItemsActions} from '@liferay/frontend-data-set-web';
import {SimpleActionLinkRenderer} from '@liferay/site-cms-site-initializer';
import React from 'react';

import {isSubtask} from '../../../../../utils/subtaskWatchActions';
import {TreeTask} from '../types';

export default function TaskTitle({
	itemsActions,
	treeTask,
}: {
	itemsActions: IItemsActions[];
	treeTask: TreeTask;
}) {
	const subtask = isSubtask(treeTask.embedded);

	return (
		<span className="task-tree-table-view-title">
			<ClayIcon
				aria-label={
					subtask
						? Liferay.Language.get('subtask')
						: Liferay.Language.get('task')
				}
				className="task-tree-table-view-type-icon"
				role="img"
				symbol={subtask ? 'indent-more' : 'check-square'}
			/>

			<SimpleActionLinkRenderer
				actions={itemsActions as any}
				itemData={treeTask}
				options={{actionId: 'actionLink'}}
				value={treeTask.embedded.title}
			/>
		</span>
	);
}
