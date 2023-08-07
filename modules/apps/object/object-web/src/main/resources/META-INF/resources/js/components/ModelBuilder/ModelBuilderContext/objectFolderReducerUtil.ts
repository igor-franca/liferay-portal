/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Edge} from 'react-flow-renderer';

import {EdgeData, ObjectFieldNode} from '../types';

export function fieldsCustomSort(objectFields: ObjectFieldNode[]) {
	const fieldOrder = ['id', 'externalReferenceCode'];

	const compareFields = (a: ObjectFieldNode, b: ObjectFieldNode) => {
		const aIndex = fieldOrder.indexOf(a.name as string);
		const bIndex = fieldOrder.indexOf(b.name as string);

		if (aIndex !== -1 && bIndex !== -1) {
			return aIndex - bIndex;
		}
		else if (aIndex !== -1) {
			return -1;
		}
		else if (bIndex !== -1) {
			return 1;
		}

		if (a.required && !b.required) {
			return -1;
		}
		else if (!a.required && b.required) {
			return 1;
		}

		return 0;
	};

	return objectFields.sort(compareFields);
}

function findEdgesWithSameSourceAndTarget(edges: Edge<EdgeData>[]) {
	const duplicates = edges.filter((edge, index, self) => {
		const foundIndex = self.findIndex(
			(item) =>
				(item.source === edge.source && item.target === edge.target) ||
				(item.source === edge.target && item.target === edge.source)
		);

		return foundIndex !== -1 && foundIndex !== index;
	});

	return duplicates;
}

export function getNonOverlappingEdges(allEdges: Edge<EdgeData>[]) {
	const overlapEdges = findEdgesWithSameSourceAndTarget(allEdges);

	const nonOverlappingEdges = overlapEdges.map((edge) => {
		const newEdge = {
			...edge,
			data: {
				...edge.data,
				sourceY: 50,
				targetY: 50,
			},
		} as Edge<EdgeData>;

		return newEdge;
	});

	const filteredEdges: Edge<EdgeData>[] = allEdges.filter((edge) => {
		return !nonOverlappingEdges.some(
			(nonOverlappingEdge) => edge.id === nonOverlappingEdge.id
		);
	});

	return [...filteredEdges, ...nonOverlappingEdges];
}
