/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {fetch} from 'frontend-js-web';

import {ITask} from '../../../../../utils/types';

export const SUBTASKS_NESTED_FIELDS = 'embedded.cmpTaskToCMPTasks';

const SUBTASKS_PAGE_SIZE = 200;

async function getJSON(url: URL) {
	const response = await fetch(url.toString());

	if (!response.ok) {
		throw new Error(response.statusText);
	}

	return response.json();
}

function getSearchURL(apiURL: string) {
	return new URL(
		Liferay.ThemeDisplay.getPortalURL() +
			Liferay.ThemeDisplay.getPathContext() +
			apiURL
	);
}

export async function getSubtasks({
	apiURL,
	parentTaskId,
	sort,
}: {
	apiURL: string;
	parentTaskId: number;
	sort?: string;
}): Promise<ITask[]> {
	const url = getSearchURL(apiURL);

	url.searchParams.set(
		'filter',
		`${url.searchParams.get('filter')} and cmpParentTaskId eq ${parentTaskId}`
	);
	url.searchParams.set(
		'nestedFields',
		`${url.searchParams.get('nestedFields')},${SUBTASKS_NESTED_FIELDS}`
	);
	url.searchParams.set('pageSize', String(SUBTASKS_PAGE_SIZE));

	if (sort) {
		url.searchParams.set('sort', sort);
	}

	const {items} = await getJSON(url);

	return items;
}

export async function getTasksCount(apiURL: string): Promise<number> {
	const url = getSearchURL(apiURL);

	url.searchParams.set('pageSize', '1');

	const {totalCount} = await getJSON(url);

	return totalCount;
}
