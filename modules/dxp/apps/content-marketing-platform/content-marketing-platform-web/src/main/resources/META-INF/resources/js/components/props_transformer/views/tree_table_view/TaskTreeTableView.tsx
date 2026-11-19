/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
	Body as ClayTableBody,
	Cell as ClayTableCell,
	Head as ClayTableHead,
	Row as ClayTableRow,
	Table as ClayTable,
} from '@clayui/core';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import {
	FrontendDataSetContext,
	IItemsActions,
} from '@liferay/frontend-data-set-web';
import {sub} from 'frontend-js-web';
import React, {useCallback, useContext, useMemo, useState} from 'react';

import {ITask, ITaskItemsActionsTask} from '../../../../utils/types';
import {getColumns} from './columns';
import TaskTreeTableCell from './components/TaskTreeTableCell';
import useTaskBatches from './hooks/useTaskBatches';
import {IColumn, TreeTask} from './types';
import getSortParameter from './utils/getSortParameter';
import {hasSubtasks, toTreeTask, updateTreeTask} from './utils/treeTasks';

import './TaskTreeTableView.scss';

const TABLE_MESSAGES = {
	columnsVisibility: '',
	columnsVisibilityClearSearch: '',
	columnsVisibilityDescription: '',
	columnsVisibilityHeader: '',
	columnsVisibilityNoResults: '',
	columnsVisibilitySearch: '',
	expandable: Liferay.Language.get('expand'),
	sortColumn: '',
	sortDescription: '',
	sorting: '',
};

export interface ITaskTreeTableViewProps {
	batchSize: number;
	countAllTasks: () => Promise<number>;
	getSubtasks: (task: ITask, sort?: string) => Promise<ITask[]>;
	items: ITask[];
	itemsActions: IItemsActions[];
	onItemSelectionChange: (item: ITask) => void;
}

/**
 * Lists the tasks of a project as a tree. Subtasks load when their task is
 * expanded, and top-level tasks load in batches on scroll. With a search or a
 * filter, the list is flat and shows the parent of each task.
 */
export default function TaskTreeTableView({
	batchSize,
	countAllTasks,
	getSubtasks,
	items,
	itemsActions,
	onItemSelectionChange,
}: ITaskTreeTableViewProps) {
	const {globalFDSState, selectable, sorts} = useContext(
		FrontendDataSetContext
	);

	const [announcement, setAnnouncement] = useState('');

	const announceLoadedItems = useCallback(
		(count: number) =>
			setAnnouncement(
				sub(Liferay.Language.get('x-items-loaded'), [count])
			),
		[]
	);

	const flat =
		!!globalFDSState?.search?.query ||
		!!globalFDSState?.filters?.some(
			(filter: {active?: boolean}) => filter.active
		);

	const {loading, sentinelRef, setTreeTasks, treeTasks} = useTaskBatches({
		batchSize,
		countAllTasks,
		flat,
		items,
		onBatchLoaded: announceLoadedItems,
	});

	const columns = useMemo(
		() => getColumns({flat, selectable}),
		[flat, selectable]
	);

	const handleTaskChange = useCallback(
		(task: ITaskItemsActionsTask) =>
			setTreeTasks((treeTasks) => updateTreeTask(treeTasks, task)),
		[setTreeTasks]
	);

	const loadSubtasks = async (item: unknown) => {
		const subtasks = await getSubtasks(
			item as TreeTask,
			getSortParameter(sorts)
		);

		announceLoadedItems(subtasks.length);

		return subtasks.map(toTreeTask);
	};

	return (
		<div className="task-tree-table-view">
			<ClayTable
				expanderColumnIndex={selectable ? 1 : 0}
				messages={TABLE_MESSAGES}
				nestedKey={flat ? undefined : 'children'}
				onLoadMore={loadSubtasks}
			>
				<ClayTableHead items={columns}>
					{(column: IColumn) => (
						<ClayTableCell key={column.key} width={column.width}>
							{column.hiddenLabel ? (
								<span className="sr-only">{column.label}</span>
							) : (
								column.label
							)}
						</ClayTableCell>
					)}
				</ClayTableHead>

				<ClayTableBody items={treeTasks} onItemsChange={setTreeTasks}>
					{(treeTask: TreeTask) => (
						<ClayTableRow
							items={columns}
							lazy={!flat && hasSubtasks(treeTask)}
						>
							{(column: IColumn) => (
								<ClayTableCell
									className={
										column.key === 'select'
											? 'cell-select-item'
											: undefined
									}
									key={column.key}
								>
									<TaskTreeTableCell
										columnKey={column.key}
										itemsActions={itemsActions}
										onSelectionChange={onItemSelectionChange}
										onTaskChange={handleTaskChange}
										treeTask={treeTask}
									/>
								</ClayTableCell>
							)}
						</ClayTableRow>
					)}
				</ClayTableBody>
			</ClayTable>

			<div
				aria-busy={loading}
				className="task-tree-table-view-loader"
				ref={sentinelRef}
			>
				{loading && (
					<ClayLoadingIndicator
						aria-label={Liferay.Language.get('loading-more-items')}
						displayType="secondary"
						size="sm"
					/>
				)}
			</div>

			<div aria-live="polite" className="sr-only">
				{announcement}
			</div>
		</div>
	);
}
