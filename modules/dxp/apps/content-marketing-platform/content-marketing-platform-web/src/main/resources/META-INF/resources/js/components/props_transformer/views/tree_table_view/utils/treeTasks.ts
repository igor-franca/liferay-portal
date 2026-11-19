/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ITask, ITaskItemsActionsTask} from '../../../../../utils/types';
import {TreeTask} from '../types';

export function applyTaskUpdate(
	treeTask: TreeTask,
	update: ITaskItemsActionsTask
): TreeTask {

	// The object entry API returns the task without the nested fields of the
	// search API, so keep the parent and the subtasks.

	return {
		...treeTask,
		actions: update.actions ?? treeTask.actions,
		embedded: {
			...(update.embedded as unknown as ITask['embedded']),
			cmpTaskToCMPTasks: treeTask.embedded.cmpTaskToCMPTasks,
			r_cmpProjectToCMPTasks_c_cmpProject:
				treeTask.embedded.r_cmpProjectToCMPTasks_c_cmpProject,
			r_cmpTaskToCMPTasks_c_cmpTask:
				treeTask.embedded.r_cmpTaskToCMPTasks_c_cmpTask,
		},
	};
}

export function hasSubtasks(treeTask: TreeTask) {
	return !!treeTask.embedded.cmpTaskToCMPTasks?.length;
}

export function toTreeTask(task: ITask): TreeTask {

	// Rows loaded outside the data set keep their permissions under
	// "embedded", so copy them where the renderers and actions read them.

	return {
		...task,
		actions: task.actions ?? task.embedded.actions,
		id: task.embedded.id,
	};
}
