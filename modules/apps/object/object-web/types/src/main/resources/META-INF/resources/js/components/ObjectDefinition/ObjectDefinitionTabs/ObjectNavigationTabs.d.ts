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

import {FormError, SidebarCategory} from '@liferay/object-js-components-web';
import React from 'react';
import './ObjectNavigationTabs.scss';
import {KeyValuePair} from '../../ObjectDetails/EditObjectDetails';
interface ObjectNavigationProps {
	creationLanguageId: Liferay.Language.Locale;
	companyKeyValuePair: KeyValuePair[];
	dbTableName: string;
	errors: FormError<ObjectDefinition>;
	externalReferenceCode: string;
	fieldDropdownItems: [];
	fieldId: string;
	fieldsApiURL: string;
	fieldsCreationMenu: {
		primaryItems?: any[];
		secondaryItems?: any[];
	};
	filterOperators: TFilterOperators;
	forbiddenChars: string[];
	forbiddenLastChars: string[];
	forbiddenNames: string[];
	handleChange: React.ChangeEventHandler<HTMLInputElement>;
	hasPublishObjectPermission: boolean;
	hasUpdateObjectDefinitionPermission: boolean;
	isDefaultStorageType: boolean;
	isApproved: boolean;
	label: LocalizedValue<string>;
	nonRelationshipObjectFieldsInfo: {
		label: LocalizedValue<string>;
		name: string;
	}[];
	objectDefinitionId: number;
	objectRelationshipId: number;
	objectFieldTypes: ObjectFieldType[];
	objectFields: ObjectField[];
	objectFieldId: number;
	pluralLabel: LocalizedValue<string>;
	portletNamespace: string;
	readOnly: boolean;
	readOnlySidebarElements: SidebarCategory[];
	screenNavigationCategoryKey: string;
	setValues: (values: Partial<ObjectDefinition>) => void;
	shortName: string;
	siteKeyValuePair: KeyValuePair[];
	storageTypes: LabelValueObject[];
	system: boolean;
	values: Partial<ObjectDefinition>;
	sidebarElements: SidebarCategory[];
	workflowStatusJSONArray: LabelValueObject[];
}
export declare function ObjectNavigationTabs({
	companyKeyValuePair,
	creationLanguageId,
	dbTableName,
	errors,
	externalReferenceCode,
	fieldDropdownItems,
	fieldId,
	fieldsApiURL,
	fieldsCreationMenu,
	filterOperators,
	forbiddenChars,
	forbiddenLastChars,
	forbiddenNames,
	handleChange,
	hasPublishObjectPermission,
	hasUpdateObjectDefinitionPermission,
	isApproved,
	isDefaultStorageType,
	label,
	nonRelationshipObjectFieldsInfo,
	objectDefinitionId,
	objectFieldId,
	objectFieldTypes,
	objectFields,
	objectRelationshipId,
	pluralLabel,
	portletNamespace,
	readOnly,
	readOnlySidebarElements,
	setValues,
	shortName,
	sidebarElements,
	siteKeyValuePair,
	storageTypes,
	values,
	workflowStatusJSONArray,
}: ObjectNavigationProps): JSX.Element;
export {};
