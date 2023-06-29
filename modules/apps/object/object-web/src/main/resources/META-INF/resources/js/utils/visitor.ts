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

class TabsVisitor {
	private _layout: ObjectLayout | null = null;

	constructor(layout: ObjectLayout) {
		this.setLayout(layout);
	}

	dispose() {
		this._layout = null;
	}

	setLayout(layout: ObjectLayout) {
		this._layout = {...layout};
	}

	mapFields(mapper: (field: ObjectLayoutColumns) => void) {
		return this._layout?.objectLayoutTabs.map(
			({objectLayoutBoxes}: ObjectLayoutTab) => {
				return objectLayoutBoxes.map(({objectLayoutRows}) => {
					return objectLayoutRows.map(({objectLayoutColumns}) => {
						return objectLayoutColumns.map((field) => {
							return field && mapper(field);
						});
					});
				});
			}
		);
	}
}

class BoxesVisitor {
	private _tab: ObjectLayoutTab | null = null;

	constructor(tab: ObjectLayoutTab) {
		this.setTab(tab);
	}

	dispose() {
		this._tab = null;
	}

	setTab(tab: ObjectLayoutTab) {
		this._tab = {...tab};
	}

	mapFields(mapper: (field: ObjectLayoutColumns) => void) {
		return this._tab?.objectLayoutBoxes.map(
			({objectLayoutRows}: ObjectLayoutBox) => {
				return objectLayoutRows.map(({objectLayoutColumns}) => {
					return objectLayoutColumns.map((field) => {
						return field && mapper(field);
					});
				});
			}
		);
	}
}

class RowsVisitor {
	private _box: ObjectLayoutBox | null = null;

	constructor(box: ObjectLayoutBox) {
		this.setBox(box);
	}

	dispose() {
		this._box = null;
	}

	setBox(box: ObjectLayoutBox) {
		this._box = {...box};
	}

	mapFields(mapper: (field: ObjectLayoutColumns) => void) {
		return this._box?.objectLayoutRows.map(
			({objectLayoutColumns}: ObjectLayoutRow) => {
				return objectLayoutColumns.map((field) => {
					return field && mapper(field);
				});
			}
		);
	}
}

export {BoxesVisitor, RowsVisitor, TabsVisitor};
