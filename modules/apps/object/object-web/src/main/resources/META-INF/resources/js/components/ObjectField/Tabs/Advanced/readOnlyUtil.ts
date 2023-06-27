/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

export const READ_ONLY_SIDE_BAR_ELEMENTS_MAP = new Map<string, string[]>([
	['fields', []],
	['general-variables', ['current-user']],
	['operators', ['and', 'diviede-by', 'minus', 'or', 'plus', 'times']],
	[
		'functions',
		[
			'compare-dates',
			'concat',
			'condition',
			'contains',
			'does-not-contain',
			'future-dates',
			'is-a-url',
			'is-an-email',
			'is-decimal',
			'is-empty',
			'is-equal-to',
			'is-greater-than',
			'is-greater-than-or-equal-to',
			'is-integer',
			'is-less-than',
			'is-less-than-or-equal-to',
			'is-not-equal-to',
			'match',
			'past-dates',
			'power',
			'range',
			'sum',
		],
	],
]);
