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

import {FormError} from '@liferay/object-js-components-web';
import React from 'react';
import './ObjectNavigationTabs.scss';
import {KeyValuePair} from '../../ObjectDetails/EditObjectDetails';
interface ObjectNavigationProps {
	companyKeyValuePair: KeyValuePair[];
	dbTableName: string;
	errors: FormError<ObjectDefinition>;
	externalReferenceCode: string;
	handleChange: React.ChangeEventHandler<HTMLInputElement>;
	hasPublishObjectPermission: boolean;
	hasUpdateObjectDefinitionPermission: boolean;
	isApproved: boolean;
	label: LocalizedValue<string>;
	nonRelationshipObjectFieldsInfo: {
		label: LocalizedValue<string>;
		name: string;
	}[];
	objectDefinitionId: number;
	objectFields: ObjectField[];
	pluralLabel: LocalizedValue<string>;
	portletNamespace: string;
	screenNavigationCategoryKey: string;
	setValues: (values: Partial<ObjectDefinition>) => void;
	shortName: string;
	siteKeyValuePair: KeyValuePair[];
	storageTypes: LabelValueObject[];
	system: boolean;
	values: Partial<ObjectDefinition>;
}
export declare function ObjectNavigationTabs({
	companyKeyValuePair,
	dbTableName,
	errors,
	externalReferenceCode,
	handleChange,
	hasPublishObjectPermission,
	hasUpdateObjectDefinitionPermission,
	isApproved,
	label,
	nonRelationshipObjectFieldsInfo,
	objectDefinitionId,
	objectFields,
	pluralLabel,
	portletNamespace,
	setValues,
	shortName,
	siteKeyValuePair,
	storageTypes,
	values,
}: ObjectNavigationProps): JSX.Element;
export {};
