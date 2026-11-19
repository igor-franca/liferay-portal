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
import React, {useCallback, useContext, useMemo} from 'react';

import {ITask} from '../../../../utils/types';
import {getColumns} from './columns';
import TaskTreeTableCell from './components/TaskTreeTableCell';
import useInfiniteScroll from './hooks/useInfiniteScroll';
import useTaskTree from './hooks/useTaskTree';
import {IColumn, TreeTask} from './types';
import getSortParameter from './utils/getSortParameter';
import {hasSubtasks} from './utils/treeTasks';

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
	getSubtasks: (task: ITask, sort?: string) => Promise<ITask[]>;
	items: ITask[];
	itemsActions: IItemsActions[];
	onItemSelectionChange: (item: ITask) => void;
}

/**
 * Lists the tasks of a project as a tree. The data set items are the
 * top-level tasks, and the data set loads the next ones on scroll. Subtasks
 * load when their task is expanded. With a search or a filter, the list is
 * flat and shows the parent of each task.
 */
export default function TaskTreeTableView({
	getSubtasks,
	items,
	itemsActions,
	onItemSelectionChange,
}: ITaskTreeTableViewProps) {
	const {globalFDSState, hasMoreItems, loadMoreItems, selectable, sorts} =
		useContext(FrontendDataSetContext);

	const flat =
		!!globalFDSState?.search?.query ||
		!!globalFDSState?.filters?.some(
			(filter: {active?: boolean}) => filter.active
		);

	const {loadSubtasks, treeTasks, updateTask} = useTaskTree({
		getSubtasks: useCallback(
			(task: ITask) => getSubtasks(task, getSortParameter(sorts)),
			[getSubtasks, sorts]
		),
		items,
	});

	const {loading, sentinelRef} = useInfiniteScroll({
		hasMore: !!hasMoreItems && !!loadMoreItems,
		onLoadMore: loadMoreItems!,
	});

	const columns = useMemo(
		() => getColumns({flat, selectable}),
		[flat, selectable]
	);

	return (
		<div className="task-tree-table-view">
			<ClayTable
				expanderColumnIndex={selectable ? 1 : 0}
				messages={TABLE_MESSAGES}
				nestedKey={flat ? undefined : 'children'}
				onLoadMore={(item: unknown) => loadSubtasks(item as TreeTask)}
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

				{/* The tree is derived from the data set items and the loaded
				subtasks, so the copy Clay keeps of the rows is not needed */}

				<ClayTableBody items={treeTasks} onItemsChange={() => {}}>
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
										onTaskChange={updateTask}
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
				{loading ? Liferay.Language.get('loading-more-items') : ''}
			</div>
		</div>
	);
}
