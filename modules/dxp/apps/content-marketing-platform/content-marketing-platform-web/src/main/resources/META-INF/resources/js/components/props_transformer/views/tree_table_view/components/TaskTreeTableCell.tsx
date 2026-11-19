/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {DateRenderer, IItemsActions} from '@liferay/frontend-data-set-web';
import React from 'react';

import {ITaskItemsActionsTask} from '../../../../../utils/types';
import StateLabel from '../../../../StateLabel';
import AssigneeRenderer from '../../../cell_renderers/AssigneeRenderer';
import {ColumnKey, TreeTask} from '../types';
import ParentTaskLink from './ParentTaskLink';
import TaskActionsDropdown from './TaskActionsDropdown';
import TaskSelectionCheckbox from './TaskSelectionCheckbox';
import TaskTitle from './TaskTitle';

export default function TaskTreeTableCell({
	columnKey,
	itemsActions,
	onSelectionChange,
	onTaskChange,
	treeTask,
}: {
	columnKey: ColumnKey;
	itemsActions: IItemsActions[];
	onSelectionChange: (treeTask: TreeTask) => void;
	onTaskChange: (task: ITaskItemsActionsTask) => void;
	treeTask: TreeTask;
}) {
	const {assignTo, dueDate, state} = treeTask.embedded;

	switch (columnKey) {
		case 'actions':
			return (
				<TaskActionsDropdown
					itemsActions={itemsActions}
					onTaskChange={onTaskChange}
					treeTask={treeTask}
				/>
			);
		case 'assignee':
			return (
				<AssigneeRenderer
					image={assignTo?.portrait}
					name={assignTo?.name}
				/>
			);
		case 'dueDate':
			return <DateRenderer value={dueDate} />;
		case 'parent':
			return (
				<ParentTaskLink
					itemsActions={itemsActions}
					treeTask={treeTask}
				/>
			);
		case 'select':
			return (
				<TaskSelectionCheckbox
					onSelectionChange={onSelectionChange}
					treeTask={treeTask}
				/>
			);
		case 'state':
			return <StateLabel dueDate={dueDate} state={state} />;
		case 'title':
			return <TaskTitle itemsActions={itemsActions} treeTask={treeTask} />;
		default:
			return null;
	}
}
