/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ITask} from '../../../../utils/types';

export type ColumnKey =
	| 'actions'
	| 'assignee'
	| 'dueDate'
	| 'parent'
	| 'select'
	| 'state'
	| 'title';

export interface IColumn {
	hiddenLabel?: boolean;
	key: ColumnKey;
	label: string;
	width?: string;
}

export interface ITasksPage {
	items: ITask[];
	page: number;
	totalCount: number;
}

export type TreeTask = ITask & {children?: TreeTask[]; id: number};
