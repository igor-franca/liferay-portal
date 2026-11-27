/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {getTasksCount} from '../../js/utils/api';

const mockGet = jest.fn();

jest.mock('@liferay/site-cms-site-initializer', () => ({
	ApiHelper: {get: (...args: any[]) => mockGet(...args)},
}));

describe('getTasksCount', () => {
	it('returns the total count of the API URL', async () => {
		mockGet.mockResolvedValueOnce({
			data: {items: [], totalCount: 15},
			error: null,
		});

		const tasksCount = await getTasksCount(
			'/o/search/v1.0/search?filter=(objectDefinitionId eq 1)&nestedFields=embedded'
		);

		const url = new URL(mockGet.mock.calls[0][0]);

		expect(tasksCount).toBe(15);
		expect(url.searchParams.get('filter')).toBe('(objectDefinitionId eq 1)');
		expect(url.searchParams.get('nestedFields')).toBeNull();
		expect(url.searchParams.get('pageSize')).toBe('1');
	});
});
