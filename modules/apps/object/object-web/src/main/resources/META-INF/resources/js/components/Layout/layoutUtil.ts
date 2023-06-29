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

import {TabsVisitor} from '../../utils/visitor';
import {TObjectField, TObjectRelationship} from './types';

interface NormalizeObjectFieldsProps {
	objectFields: TObjectField[];
	objectLayout: Partial<ObjectLayout>;
}

export function normalizeObjectFields({
	objectFields,
	objectLayout,
}: NormalizeObjectFieldsProps): TObjectField[] {
	const visitor = new TabsVisitor(objectLayout as ObjectLayout);

	const objectFieldNames = objectFields.map(({name}) => name);

	const normalizedObjectFields = [...objectFields];

	visitor.mapFields((field) => {
		const objectFieldIndex = objectFieldNames.indexOf(
			field.objectFieldName
		);
		normalizedObjectFields[objectFieldIndex].inLayout = true;
	});

	return normalizedObjectFields;
}

interface NormalizeObjectRelationshipsProps {
	objectLayoutTabs: ObjectLayoutTab[];
	objectRelationships: TObjectRelationship[];
}

export function normalizeObjectRelationships({
	objectLayoutTabs,
	objectRelationships,
}: NormalizeObjectRelationshipsProps): TObjectRelationship[] {
	const objectRelationshipIds = objectRelationships.map(({id}) => id);

	const normalizedObjectRelationships = [...objectRelationships];

	objectLayoutTabs.forEach(({objectRelationshipId}) => {
		if (objectRelationshipId) {
			const objectRelationshipIndex = objectRelationshipIds.indexOf(
				objectRelationshipId
			);

			normalizedObjectRelationships[
				objectRelationshipIndex
			].inLayout = true;
		}
	});

	return normalizedObjectRelationships;
}
