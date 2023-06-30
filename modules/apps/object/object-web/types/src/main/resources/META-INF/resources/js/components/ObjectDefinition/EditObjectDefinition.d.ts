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

import {CustomItem, SidebarCategory} from '@liferay/object-js-components-web';
import {KeyValuePair} from '../ObjectDetails/EditObjectDetails';
export declare type CreationMenu = {
	primaryItems?: any[];
	secondaryItems?: any[];
};
interface EditObjectDefinitionProps {
	actionDropdownItems: [];
	actionId: string;
	actionsApiURL: string;
	actionsCreationMenu: {
		primaryItems?: any[];
		secondaryItems?: any[];
	};
	backURL: string;
	baseResourceURL: string;
	companyKeyValuePair: KeyValuePair[];
	creationLanguageId: Liferay.Language.Locale;
	dbTableName: string;
	externalReferenceCode: string;
	fieldDropdownItems: [];
	fieldId: string;
	fieldsApiURL: string;
	fieldsCreationMenu: CreationMenu;
	filterOperators: TFilterOperators;
	forbiddenChars: string[];
	forbiddenLastChars: string[];
	forbiddenNames: string[];
	hasPublishObjectPermission: boolean;
	hasUpdateObjectDefinitionPermission: boolean;
	isApproved: boolean;
	isDefaultStorageType: boolean;
	label: LocalizedValue<string>;
	layoutDropdownitems: [];
	layoutFDSId: string;
	layoutsApiURL: string;
	layoutsCreationMenu: CreationMenu;
	nonRelationshipObjectFieldsInfo: {
		label: LocalizedValue<string>;
		name: string;
	}[];
	objectActionExecutors: CustomItem[];
	objectActionTriggers: CustomItem[];
	objectDefinitionId: number;
	objectDefinitionsRelationshipsURL: string;
	objectFieldTypes: ObjectFieldType[];
	onSubmit: (draft: boolean) => void;
	pluralLabel: LocalizedValue<string>;
	portletNamespace: string;
	readOnly: boolean;
	screenNavigationCategoryKey: string;
	setValues: (values: Partial<ObjectDefinition>) => void;
	shortName: string;
	sidebarElements: SidebarCategory[];
	siteKeyValuePair: KeyValuePair[];
	storageTypes: LabelValueObject[];
	system: boolean;
	validateActionExpressionURL: string;
	viewsApiURL: string;
	viewsCreationMenu: CreationMenu;
	viewsDropdownItems: [];
	viewsFDSId: string;
	workflowStatusJSONArray: LabelValueObject[];
}
export default function EditObjectDefinition({
	actionDropdownItems,
	actionId,
	actionsApiURL,
	actionsCreationMenu,
	backURL,
	baseResourceURL,
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
	layoutDropdownitems,
	layoutFDSId,
	layoutsApiURL,
	layoutsCreationMenu,
	nonRelationshipObjectFieldsInfo,
	objectActionExecutors,
	objectActionTriggers,
	objectDefinitionId,
	objectDefinitionsRelationshipsURL,
	objectFieldTypes,
	pluralLabel,
	portletNamespace,
	readOnly,
	screenNavigationCategoryKey,
	shortName,
	sidebarElements,
	siteKeyValuePair,
	storageTypes,
	system,
	validateActionExpressionURL,
	viewsApiURL,
	viewsCreationMenu,
	viewsDropdownItems,
	viewsFDSId,
	workflowStatusJSONArray,
}: EditObjectDefinitionProps): JSX.Element;
export {};
