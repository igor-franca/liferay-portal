/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {IItemsActions} from '@liferay/frontend-data-set-web';
import {SimpleActionLinkRenderer} from '@liferay/site-cms-site-initializer';
import React from 'react';

import {TreeTask} from '../types';

export default function ParentTaskLink({
	itemsActions,
	treeTask,
}: {
	itemsActions: IItemsActions[];
	treeTask: TreeTask;
}) {
	const parentTask = treeTask.embedded.r_cmpTaskToCMPTasks_c_cmpTask;

	if (!parentTask) {
		return null;
	}

	return (
		<SimpleActionLinkRenderer
			actions={itemsActions as any}
			itemData={{embedded: parentTask}}
			options={{actionId: 'actionLink'}}
			requiresUpdatePermission={false}
			value={parentTask.title}
		/>
	);
}
