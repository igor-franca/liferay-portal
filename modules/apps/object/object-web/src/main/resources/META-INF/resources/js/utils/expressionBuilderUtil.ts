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

import {SidebarCategory} from '@liferay/object-js-components-web';

export function filterSideBarElements(
	sidebarElemets: SidebarCategory[],
	filterSidebarElementsMap: Map<string, string[]>
) {
	const filteredElements = sidebarElemets.filter((sidebarElement) =>
		filterSidebarElementsMap.has(sidebarElement.name)
	);

	const filteredItems = filteredElements.map((sidebarElement) => {
		if (
			sidebarElement.name === 'fields' &&
			filterSidebarElementsMap.get('fields')?.length === 0
		) {
			return sidebarElement;
		}

		const newItems = sidebarElement.items.filter((sidebarItem) =>
			filterSidebarElementsMap
				.get(sidebarElement.name)
				?.includes(sidebarItem.name)
		);

		return {
			...sidebarElement,
			items: newItems,
		} as SidebarCategory;
	});

	return filteredItems;
}
