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

import ClayTabs from '@clayui/tabs';
import {
	CustomItem,
	FormError,
	SidebarCategory,
} from '@liferay/object-js-components-web';
import React, {useState} from 'react';

import './ObjectNavigationTabs.scss';
import Layouts from '../../Layout/Layouts';
import Actions from '../../ObjectAction/Actions';
import EditObjectDetails, {
	KeyValuePair,
} from '../../ObjectDetails/EditObjectDetails';
import Fields from '../../ObjectField/Fields';
import Validations from '../../ObjectValidation/Validations';
import Views from '../../ObjectView/Views';
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

export function ObjectNavigationTabs({
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
}: ObjectNavigationProps) {
	const [active, setActive] = useState(5);

	return (
		<>
			<div className="lfr__objects-navigation-tabs">
				<ClayTabs
					active={active}
					className="container-fluid container-fluid-max-xl"
					onActiveChange={setActive}
				>
					<ClayTabs.Item
						innerProps={{
							'aria-controls': 'tabpanel-1',
						}}
					>
						{Liferay.Language.get('details')}
					</ClayTabs.Item>

					<ClayTabs.Item
						innerProps={{
							'aria-controls': 'tabpanel-2',
						}}
					>
						{Liferay.Language.get('fields')}
					</ClayTabs.Item>

					<ClayTabs.Item
						innerProps={{
							'aria-controls': 'tabpanel-3',
						}}
					>
						{Liferay.Language.get('layouts')}
					</ClayTabs.Item>

					<ClayTabs.Item
						innerProps={{
							'aria-controls': 'tabpanel-4',
						}}
					>
						{Liferay.Language.get('actions')}
					</ClayTabs.Item>

					<ClayTabs.Item
						innerProps={{
							'aria-controls': 'tabpanel-5',
						}}
					>
						{Liferay.Language.get('views')}
					</ClayTabs.Item>

					<ClayTabs.Item
						innerProps={{
							'aria-controls': 'tabpanel-6',
						}}
					>
						{Liferay.Language.get('validations')}
					</ClayTabs.Item>
				</ClayTabs>
			</div>

			<div className="lfr__objects-navigation-tabs-content">
				<ClayTabs.Content activeIndex={active} fade>
					<ClayTabs.TabPane aria-labelledby="details-tab">
						<EditObjectDetails
							companyKeyValuePair={companyKeyValuePair}
							dbTableName={dbTableName}
							errors={errors}
							externalReferenceCode={externalReferenceCode}
							handleChange={handleChange}
							hasPublishObjectPermission={
								hasPublishObjectPermission
							}
							hasUpdateObjectDefinitionPermission={
								hasUpdateObjectDefinitionPermission
							}
							isApproved={isApproved}
							label={label}
							nonRelationshipObjectFieldsInfo={
								nonRelationshipObjectFieldsInfo
							}
							objectDefinitionId={objectDefinitionId}
							objectFields={objectFields}
							pluralLabel={pluralLabel}
							portletNamespace={portletNamespace}
							setValues={setValues}
							shortName={shortName}
							siteKeyValuePair={siteKeyValuePair}
							storageTypes={storageTypes}
							values={values}
						/>
					</ClayTabs.TabPane>

					<ClayTabs.TabPane aria-labelledby="fields-tab">
						<Fields
							apiURL={fieldsApiURL}
							baseResourceURL={baseResourceURL}
							creationLanguageId={creationLanguageId}
							creationMenu={fieldsCreationMenu}
							filterOperators={filterOperators}
							forbiddenChars={forbiddenChars}
							forbiddenLastChars={forbiddenLastChars}
							forbiddenNames={forbiddenNames}
							id={fieldId}
							isApproved={isApproved}
							isDefaultStorageType={isDefaultStorageType}
							items={fieldDropdownItems}
							objectDefinitionExternalReferenceCode={
								externalReferenceCode
							}
							objectFieldTypes={objectFieldTypes}
							objectName={shortName}
							readOnly={readOnly}
							sidebarElements={sidebarElements}
							workflowStatusJSONArray={workflowStatusJSONArray}
						/>
					</ClayTabs.TabPane>

					<ClayTabs.TabPane aria-labelledby="layouts-tab">
						<Layouts
							apiURL={layoutsApiURL}
							creationLanguageId={creationLanguageId}
							creationMenu={layoutsCreationMenu}
							id={layoutFDSId}
							items={layoutDropdownitems}
							objectDefinitionExternalReferenceCode={
								externalReferenceCode
							}
							objectFieldTypes={objectFieldTypes}
							readOnly={readOnly}
						/>
					</ClayTabs.TabPane>

					<ClayTabs.TabPane aria-labelledby="actions-tab">
						<Actions
							apiURL={actionsApiURL}
							creationLanguageId={creationLanguageId}
							creationMenu={actionsCreationMenu}
							id={actionId}
							isApproved={isApproved}
							items={actionDropdownItems}
							objectActionExecutors={objectActionExecutors}
							objectActionTriggers={objectActionTriggers}
							objectDefinitionExternalReferenceCode={
								externalReferenceCode
							}
							objectDefinitionId={objectDefinitionId}
							objectDefinitionsRelationshipsURL={
								objectDefinitionsRelationshipsURL
							}
							sidebarElements={sidebarElements}
							systemObject={system}
							validateActionExpressionURL={
								validateActionExpressionURL
							}
						/>
					</ClayTabs.TabPane>

					<ClayTabs.TabPane aria-labelledby="views-tab">
						<Views
							apiURL={viewsApiURL}
							creationLanguageId={creationLanguageId}
							creationMenu={viewsCreationMenu}
							filterOperators={filterOperators}
							id={viewsFDSId}
							items={viewsDropdownItems}
							objectDefinitionExternalReferenceCode={
								externalReferenceCode
							}
							readOnly={readOnly}
							workflowStatusJSONArray={workflowStatusJSONArray}
						/>
					</ClayTabs.TabPane>

					<ClayTabs.TabPane aria-labelledby="views-tab">
						<Validations
							apiURL={validationsApiURL}
							creationMenu={validationsCreationMenu}
							id={validationsFDSId}
							items={validationsDropdownItems}
							objectDefinitionExternalReferenceCode={
								externalReferenceCode
							}
							objectValidationRuleEngines={
								objectValidationRuleEngines
							}
						/>
					</ClayTabs.TabPane>
				</ClayTabs.Content>
			</div>
		</>
	);
}
