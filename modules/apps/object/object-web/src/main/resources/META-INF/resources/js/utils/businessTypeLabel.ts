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

export function getBusinessTypeLabel(businessType: string) {
	switch (businessType) {
		case 'DateTime':
			return Liferay.Language.get(

				// create date-time language key

				'dateTime'
			);

		case 'LongInteger':
			return Liferay.Language.get('long-integer');

		case 'LongText':
			return Liferay.Language.get('long-text');

		case 'MultiselectPicklist':
			return Liferay.Language.get('multiselect-picklist');

		case 'PrecisionDecimal':
			return Liferay.Language.get('precision-decimal');

		case 'RichText':
			return Liferay.Language.get('rich-text');

		default:
			return Liferay.Language.get(`${businessType.toLowerCase()}`);
	}
}
