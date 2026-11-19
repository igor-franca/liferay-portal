/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {IColumn} from './types';

export function getColumns({
	flat,
	selectable,
}: {
	flat: boolean;
	selectable?: boolean;
}): IColumn[] {
	const columns: IColumn[] = [];

	if (selectable) {
		columns.push({
			hiddenLabel: true,
			key: 'select',
			label: Liferay.Language.get('item-selection'),
			width: '51px',
		});
	}

	columns.push({key: 'title', label: Liferay.Language.get('title')});

	if (flat) {
		columns.push({key: 'parent', label: Liferay.Language.get('parent')});
	}

	columns.push(
		{key: 'assignee', label: Liferay.Language.get('assign-to')},
		{key: 'dueDate', label: Liferay.Language.get('due-date')},
		{key: 'state', label: Liferay.Language.get('state')},
		{
			hiddenLabel: true,
			key: 'actions',
			label: Liferay.Language.get('actions'),
			width: '56px',
		}
	);

	return columns;
}
