/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {getLocalizableLabel} from '@liferay/object-js-components-web';

import {ObjectRelationshipEdgeData} from '../types';
import {manyMarkerId} from './ManyMarker';
import {ObjectRelationshipMap} from './ObjectRelationshipMap';
import {oneMarkerId} from './OneMarker';

interface ObjectRelationshipEdgeFactory {
	objectDefinition: ObjectDefinitionNodeData;
	objectRelationship: ObjectRelationship;
	objectRelationshipMap: ObjectRelationshipMap;
	selectedObjectRelationshipId: number | undefined;
}

export function objectRelationshipEdgeFactory({
	objectDefinition,
	objectRelationship,
	objectRelationshipMap,
	selectedObjectRelationshipId,
}: ObjectRelationshipEdgeFactory) {
	const objectRelationships: ObjectRelationship[] = [];

	const isSelfObjectRelationship =
		objectRelationship.objectDefinitionExternalReferenceCode1 ===
		objectRelationship.objectDefinitionExternalReferenceCode2;

	const objectDefinition1ObjectDefinition2ObjectRelationships = objectRelationshipMap.getValueByExternalReferenceCodes(
		objectRelationship.objectDefinitionExternalReferenceCode1,
		objectRelationship.objectDefinitionExternalReferenceCode2
	);

	const objectDefinition2ObjectDefinition1ObjectRelationships = objectRelationshipMap.getValueByExternalReferenceCodes(
		objectRelationship.objectDefinitionExternalReferenceCode2,
		objectRelationship.objectDefinitionExternalReferenceCode1
	);

	if (objectDefinition1ObjectDefinition2ObjectRelationships) {
		objectRelationships.push(
			...objectDefinition1ObjectDefinition2ObjectRelationships
		);

		objectRelationshipMap.deleteByExternalReferenceCodes(
			objectRelationship.objectDefinitionExternalReferenceCode1,
			objectRelationship.objectDefinitionExternalReferenceCode2
		);
	}

	if (
		objectDefinition2ObjectDefinition1ObjectRelationships &&
		!isSelfObjectRelationship
	) {
		objectRelationships.push(
			...objectDefinition2ObjectDefinition1ObjectRelationships
		);

		objectRelationshipMap.deleteByExternalReferenceCodes(
			objectRelationship.objectDefinitionExternalReferenceCode2,
			objectRelationship.objectDefinitionExternalReferenceCode1
		);
	}

	if (objectRelationships.length !== 0) {
		return {
			data: objectRelationships.map((objectRelationship) => {
				return {
					defaultLanguageId: objectDefinition.defaultLanguageId,
					id: objectRelationship.id,
					label: getLocalizableLabel(
						objectDefinition.defaultLanguageId,
						objectRelationship.label,
						objectRelationship.name
					),
					markerEndId: manyMarkerId,
					markerStartId:
						objectRelationship.type === 'manyToMany'
							? manyMarkerId
							: oneMarkerId,
					name: objectRelationship.name,
					selected:
						selectedObjectRelationshipId === objectRelationship.id,
					type: objectRelationship.type,
				};
			}) as ObjectRelationshipEdgeData[],
			id: `reactflow__edge-object-relationship-parent-${objectRelationship.objectDefinitionId1}-child-${objectRelationship.objectDefinitionId2}`,
			source: `${objectDefinition.id}`,
			sourceHandle: isSelfObjectRelationship ? 'fixedLeftHandle' : null,
			target: `${objectRelationship.objectDefinitionId2}`,
			targetHandle: isSelfObjectRelationship ? 'fixedRightHandle' : null,
			type: isSelfObjectRelationship
				? 'selfObjectRelationshipEdge'
				: 'defaultObjectRelationshipEdge',
		};
	}
}
