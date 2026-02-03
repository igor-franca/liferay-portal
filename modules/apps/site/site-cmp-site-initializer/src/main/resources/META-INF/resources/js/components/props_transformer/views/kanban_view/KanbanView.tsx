/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useCallback, useEffect} from 'react';

import {patchTaskById} from '../../../../utils/api';
import {IItemsActions, ITask} from '../../../../utils/types';
import {UPDATE_TASKS_QUICK_FILTER_VISIBILITY} from '../../../task/TasksQuickFilters';
import Board from './components/Board';
import {KanbanViewContext} from './context';
import {useOptimisticBoard} from './hooks/useOptimisticBoard';

interface KanbanViewProps {
	dataSetId: string;
	items: ITask[];
	itemsActions: IItemsActions[];
}

function KanbanView(props: KanbanViewProps) {
	const handleApiCall = useCallback(
		async (task: ITask, newStatus: {name: string; key: string}) => {
			return await patchTaskById({
				body: {state: newStatus.key},
				taskId: String(task.embedded.id),
			});
		},
		[props.itemsActions]
	);

	const {boardData, moveTask} = useOptimisticBoard(
		props.items,
		handleApiCall
	);

	const changeTaskStatus = useCallback(
		(task: ITask, newStatus: {name: string; key: string}) => {
			moveTask(task, newStatus);
		},
		[moveTask]
	);

	useEffect(() => {
		Liferay.fire(UPDATE_TASKS_QUICK_FILTER_VISIBILITY, {visible: false});

		return () => {
			Liferay.fire(UPDATE_TASKS_QUICK_FILTER_VISIBILITY, {visible: true});
		};
	}, []);

	return (
		<KanbanViewContext.Provider
			value={{
				boardData,
				changeTaskStatus,
				dataSetId: props.dataSetId,
				itemsActions: props.itemsActions,
			}}
		>
			<Board />
		</KanbanViewContext.Provider>
	);
}

export default KanbanView;
