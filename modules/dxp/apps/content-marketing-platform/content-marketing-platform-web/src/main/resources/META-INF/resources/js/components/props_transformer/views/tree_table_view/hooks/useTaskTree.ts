/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useCallback, useMemo, useState} from 'react';

import {ITask, ITaskItemsActionsTask} from '../../../../../utils/types';
import {TreeTask} from '../types';
import {applyTaskUpdate, toTreeTask} from '../utils/treeTasks';

/**
 * Builds the tree from the data set items (the top-level tasks), the
 * subtasks loaded on expand, and the tasks updated by row actions.
 */
export default function useTaskTree({
	getSubtasks,
	items,
}: {
	getSubtasks: (task: ITask) => Promise<ITask[]>;
	items: ITask[];
}) {
	const [subtasksByTaskId, setSubtasksByTaskId] = useState(
		new Map<number, ITask[]>()
	);
	const [updatesByTaskId, setUpdatesByTaskId] = useState(
		new Map<number, ITaskItemsActionsTask>()
	);

	const treeTasks = useMemo(() => {
		const buildTreeTasks = (tasks: ITask[]): TreeTask[] =>
			tasks.map((task) => {
				const update = updatesByTaskId.get(task.embedded.id);
				const subtasks = subtasksByTaskId.get(task.embedded.id);

				const treeTask = update
					? applyTaskUpdate(toTreeTask(task), update)
					: toTreeTask(task);

				return subtasks
					? {...treeTask, children: buildTreeTasks(subtasks)}
					: treeTask;
			});

		return buildTreeTasks(items);
	}, [items, subtasksByTaskId, updatesByTaskId]);

	const loadSubtasks = useCallback(
		async (task: ITask) => {
			const subtasks = await getSubtasks(task);

			setSubtasksByTaskId((subtasksByTaskId) =>
				new Map(subtasksByTaskId).set(task.embedded.id, subtasks)
			);

			return subtasks.map(toTreeTask);
		},
		[getSubtasks]
	);

	const updateTask = useCallback(
		(update: ITaskItemsActionsTask) =>
			setUpdatesByTaskId((updatesByTaskId) =>
				new Map(updatesByTaskId).set(update.embedded.id, update)
			),
		[]
	);

	return {loadSubtasks, treeTasks, updateTask};
}
