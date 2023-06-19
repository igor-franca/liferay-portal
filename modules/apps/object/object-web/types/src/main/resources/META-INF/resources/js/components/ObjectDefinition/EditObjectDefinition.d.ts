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

/// <reference types="react" />

import {SidebarCategory} from '@liferay/object-js-components-web';
import {KeyValuePair} from '../ObjectDetails/EditObjectDetails';
interface EditObjectDefinitionProps {
	backURL: string;
	creationLanguageId: Liferay.Language.Locale;
	companyKeyValuePair: KeyValuePair[];
	dbTableName: string;
	externalReferenceCode: string;
	fieldDropdownItems: [];
	fieldId: string;
	fieldUrl: string;
	fieldsApiURL: string;
	fieldsCreationMenu: {
		primaryItems?: any[];
		secondaryItems?: any[];
	};
	filterOperators: TFilterOperators;
	forbiddenChars: string[];
	forbiddenLastChars: string[];
	forbiddenNames: string[];
	hasPublishObjectPermission: boolean;
	hasUpdateObjectDefinitionPermission: boolean;
	isApproved: boolean;
	isDefaultStorageType: boolean;
	label: LocalizedValue<string>;
	nonRelationshipObjectFieldsInfo: {
		label: LocalizedValue<string>;
		name: string;
	}[];
	objectDefinitionId: number;
	objectFieldTypes: ObjectFieldType[];
	objectRelationshipId: number;
	objectFieldId: number;
	onSubmit: (draft: boolean) => void;
	pluralLabel: LocalizedValue<string>;
	portletNamespace: string;
	readOnly: boolean;
	readOnlySidebarElements: SidebarCategory[];
	screenNavigationCategoryKey: string;
	setValues: (values: Partial<ObjectDefinition>) => void;
	shortName: string;
	sidebarElements: SidebarCategory[];
	workflowStatusJSONArray: LabelValueObject[];
	siteKeyValuePair: KeyValuePair[];
	storageTypes: LabelValueObject[];
	system: boolean;
}
export default function EditObjectDefinition({
	backURL,
	companyKeyValuePair,
	creationLanguageId,
	dbTableName,
	externalReferenceCode,
	fieldDropdownItems,
	fieldId,
	fieldsApiURL,
	fieldsCreationMenu,
	filterOperators,
	forbiddenChars,
	forbiddenLastChars,
	forbiddenNames,
	hasPublishObjectPermission,
	hasUpdateObjectDefinitionPermission,
	isApproved,
	isDefaultStorageType,
	label,
	nonRelationshipObjectFieldsInfo,
	objectDefinitionId,
	objectFieldId,
	objectFieldTypes,
	objectRelationshipId,
	pluralLabel,
	portletNamespace,
	readOnly,
	readOnlySidebarElements,
	screenNavigationCategoryKey,
	shortName,
	sidebarElements,
	siteKeyValuePair,
	storageTypes,
	system,
	workflowStatusJSONArray,
}: EditObjectDefinitionProps): JSX.Element;
export {};
