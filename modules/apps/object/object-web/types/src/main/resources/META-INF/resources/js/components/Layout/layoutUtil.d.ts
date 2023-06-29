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

import {TObjectField, TObjectRelationship} from './types';
interface NormalizeObjectFieldsProps {
	objectFields: TObjectField[];
	objectLayout: Partial<ObjectLayout>;
}
export declare function normalizeObjectFields({
	objectFields,
	objectLayout,
}: NormalizeObjectFieldsProps): TObjectField[];
interface NormalizeObjectRelationshipsProps {
	objectLayoutTabs: ObjectLayoutTab[];
	objectRelationships: TObjectRelationship[];
}
export declare function normalizeObjectRelationships({
	objectLayoutTabs,
	objectRelationships,
}: NormalizeObjectRelationshipsProps): TObjectRelationship[];
export {};
