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

import {
	CustomItem,
	FormError,
	SidebarCategory,
} from '@liferay/object-js-components-web';
import React from 'react';
import './ObjectNavigationTabs.scss';
import {KeyValuePair} from '../../ObjectDetails/EditObjectDetails';
import {CreationMenu} from '../EditObjectDefinition';
interface ObjectNavigationProps {
	actionDropdownItems: [];
	actionId: string;
	actionsApiURL: string;
	actionsCreationMenu: {
		primaryItems?: any[];
		secondaryItems?: any[];
	};
	baseResourceURL: string;
	companyKeyValuePair: KeyValuePair[];
	creationLanguageId: Liferay.Language.Locale;
	dbTableName: string;
	errors: FormError<ObjectDefinition>;
	externalReferenceCode: string;
	fieldDropdownItems: [];
	fieldId: string;
	fieldsApiURL: string;
	fieldsCreationMenu: CreationMenu;
	filterOperators: TFilterOperators;
	forbiddenChars: string[];
	forbiddenLastChars: string[];
	forbiddenNames: string[];
	handleChange: React.ChangeEventHandler<HTMLInputElement>;
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
	objectFields: ObjectField[];
	objectValidationRuleEngines: ObjectValidationType[];
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
	validationsApiURL: string;
	validationsCreationMenu: CreationMenu;
	validationsDropdownItems: [];
	validationsFDSId: string;
	values: Partial<ObjectDefinition>;
	viewsApiURL: string;
	viewsCreationMenu: CreationMenu;
	viewsDropdownItems: [];
	viewsFDSId: string;
	workflowStatusJSONArray: LabelValueObject[];
}
export declare function ObjectNavigationTabs({
	actionDropdownItems,
	actionId,
	actionsApiURL,
	actionsCreationMenu,
	baseResourceURL,
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
	objectFields,
	objectValidationRuleEngines,
	pluralLabel,
	portletNamespace,
	readOnly,
	setValues,
	shortName,
	sidebarElements,
	siteKeyValuePair,
	storageTypes,
	system,
	validateActionExpressionURL,
	validationsApiURL,
	validationsCreationMenu,
	validationsDropdownItems,
	validationsFDSId,
	values,
	viewsApiURL,
	viewsCreationMenu,
	viewsDropdownItems,
	viewsFDSId,
	workflowStatusJSONArray,
}: ObjectNavigationProps): JSX.Element;
export {};
