/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {FDS_PAGINATION_DELTA_ALL} from '@liferay/frontend-data-set-web';
import {fetch} from 'frontend-js-web';

export default function getNestedTasksProps(
	additionalAPIURLParameters: string,
	apiURL: string
) {
	return {
		additionalAPIURLParameters,
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
				? undefined
				: additionalAPIURLParameters,
		nestedItemsKey: 'embedded.id',
		nestedItemsReferenceKey: 'embedded.cmpTaskToCMPTasks',
		onLoadMore: async (item: {embedded: {id: number}}) => {
			const url = new URL(apiURL, Liferay.ThemeDisplay.getPortalURL());

			url.searchParams.set(
				'filter',
				`cmpTaskCMPTaskId eq ${item.embedded.id}`
			);

			const response = await fetch(url.toString());

			const {items} = await response.json();

			return items;
		},
	};
}
