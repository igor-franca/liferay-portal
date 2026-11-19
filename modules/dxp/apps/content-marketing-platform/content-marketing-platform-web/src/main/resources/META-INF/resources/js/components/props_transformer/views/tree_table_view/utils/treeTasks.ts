/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ITask, ITaskItemsActionsTask} from '../../../../../utils/types';
import {TreeTask} from '../types';

/**
 * Follows the data set items, and keeps the rows the view already has, with
 * their loaded subtasks and the updates made by row actions.
 */
export function mergeTreeTasks(
	treeTasks: TreeTask[],
	tasks: ITask[]
): TreeTask[] {
	const treeTasksById = new Map(
		treeTasks.map((treeTask) => [treeTask.id, treeTask])
	);

	return tasks.map(
		(task) => treeTasksById.get(task.embedded.id) ?? toTreeTask(task)
	);
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

export function updateTreeTask(
	treeTasks: TreeTask[],
	updatedTask: ITaskItemsActionsTask
): TreeTask[] {
	return treeTasks.map((treeTask) => {
		if (treeTask.id === updatedTask.embedded.id) {

			// The object entry API returns the task without the nested fields
			// of the search API, so keep the parent and the children.

			return {
				...treeTask,
				actions: updatedTask.actions ?? treeTask.actions,
				embedded: {
					...(updatedTask.embedded as unknown as ITask['embedded']),
					cmpTaskToCMPTasks: treeTask.embedded.cmpTaskToCMPTasks,
					r_cmpProjectToCMPTasks_c_cmpProject:
						treeTask.embedded.r_cmpProjectToCMPTasks_c_cmpProject,
					r_cmpTaskToCMPTasks_c_cmpTask:
						treeTask.embedded.r_cmpTaskToCMPTasks_c_cmpTask,
				},
			};
		}

		if (treeTask.children) {
			return {
				...treeTask,
				children: updateTreeTask(treeTask.children, updatedTask),
			};
		}

		return treeTask;
	});
}
