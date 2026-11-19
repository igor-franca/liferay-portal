/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {FDS_PAGINATION_DELTA_ALL, IView} from '@liferay/frontend-data-set-web';
import React from 'react';

import {ITask} from '../../../../utils/types';
import TaskTreeTableView, {ITaskTreeTableViewProps} from './TaskTreeTableView';
import {SUBTASKS_NESTED_FIELDS, getSubtasks} from './utils/taskSearchAPI';

const BATCH_SIZE = 20;

const NESTED_FIELDS_PARAMETER = `nestedFields=${SUBTASKS_NESTED_FIELDS}`;

/**
 * Returns the tree table view and the data set props it needs. The first
 * level asks for tasks only, and a search, a filter or a view that loads
 * every item (Kanban, Calendar) asks for tasks and subtasks.
 */
export default function getTaskTreeTableView(apiURL: string) {
	const loadSubtasks = (task: ITask, sort?: string) =>
		getSubtasks({apiURL, parentTaskId: task.embedded.id, sort});

	const view: IView = {
		component: (props: Omit<ITaskTreeTableViewProps, 'getSubtasks'>) => (
			<TaskTreeTableView {...props} getSubtasks={loadSubtasks} />
		),
		default: true,
		initialPaginationDelta: BATCH_SIZE,
		label: Liferay.Language.get('table'),
		name: 'treeTable',
		selectable: true,
		showPagination: false,
		thumbnail: 'table',
	};

	const dataSetProps = {
		additionalAPIURLParameters: `filter=cmpSubtask ne true&${NESTED_FIELDS_PARAMETER}`,
		additionalAPIURLParametersTransformer: ({
			additionalAPIURLParameters,
			delta,
			odataFiltersStrings,
			searchParam,
		}: {
			additionalAPIURLParameters?: string;
			delta?: number;
			odataFiltersStrings?: string[];
			searchParam?: string;
		}) =>
			delta === FDS_PAGINATION_DELTA_ALL ||
			odataFiltersStrings?.length ||
			searchParam
				? NESTED_FIELDS_PARAMETER
				: additionalAPIURLParameters,
	};

	return {dataSetProps, view};
}
