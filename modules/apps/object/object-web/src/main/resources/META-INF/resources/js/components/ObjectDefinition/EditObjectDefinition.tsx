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
	API,
	ManagementToolbar,
	SidebarCategory,
} from '@liferay/object-js-components-web';
import React, {useEffect, useState} from 'react';

import {defaultLanguageId} from '../../utils/constants';
import {KeyValuePair} from '../ObjectDetails/EditObjectDetails';
import {ObjectNavigationTabs} from './ObjectDefinitionTabs/ObjectNavigationTabs';
import {onSubmitObjectDefinition} from './objectDefinitionUtil';
import {useObjectDefinitionForm} from './useObjectDefinitionForm';

interface EditObjectDefinitionProps {
	backURL: string;
	baseResourceURL: string;
	companyKeyValuePair: KeyValuePair[];
	creationLanguageId: Liferay.Language.Locale;
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
	objectFieldId: number;
	objectFieldTypes: ObjectFieldType[];
	objectRelationshipId: number;
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
	workflowStatusJSONArray: LabelValueObject[];
}

export default function EditObjectDefinition({
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
	nonRelationshipObjectFieldsInfo,
	objectDefinitionId,
	objectFieldId,
	objectFieldTypes,
	objectRelationshipId,
	pluralLabel,
	portletNamespace,
	readOnly,
	screenNavigationCategoryKey,
	shortName,
	sidebarElements,
	siteKeyValuePair,
	storageTypes,
	system,
	workflowStatusJSONArray,
}: EditObjectDefinitionProps) {
	const [objectFields, setObjectFields] = useState<ObjectField[]>([]);
	const {
		errors,
		handleChange,
		handleValidate,
		setValues,
		values,
	} = useObjectDefinitionForm({
		initialValues: {
			defaultLanguageId: 'en_US',
			externalReferenceCode,
			id: objectDefinitionId,
			label,
			name: shortName,
			pluralLabel,
		},
		onSubmit: () => {},
	});

	useEffect(() => {
		const makeFetch = async () => {
			const objectFieldsResponse = await API.getObjectFieldsByExternalReferenceCode(
				externalReferenceCode
			);
			const objectDefinitionResponse = await API.getObjectDefinitionByExternalReferenceCode(
				externalReferenceCode
			);

			setValues(objectDefinitionResponse);
			setObjectFields(objectFieldsResponse);
		};

		makeFetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [objectDefinitionId]);

	return (
		<>
			<ManagementToolbar
				backURL={backURL}
				badgeClassName={system ? 'label-info' : 'label-warning'}
				badgeLabel={
					system
						? Liferay.Language.get('system')
						: Liferay.Language.get('custom')
				}
				className="border-bottom"
				enableBoxShadow={false}
				entityId={objectDefinitionId}
				externalReferenceCode={externalReferenceCode}
				externalReferenceCodeSaveURL={`/o/object-admin/v1.0/object-definitions/${objectDefinitionId}`}
				hasPublishPermission={hasPublishObjectPermission}
				hasUpdatePermission={hasUpdateObjectDefinitionPermission}
				helpMessage={Liferay.Language.get(
					'unique-key-for-referencing-the-object-definition'
				)}
				isApproved={isApproved}
				label={label[defaultLanguageId] as string}
				onExternalReferenceCodeChange={(
					externalReferenceCode: string
				) => {
					setValues({
						externalReferenceCode,
					});
				}}
				onGetEntity={() =>
					API.getObjectDefinitionById(objectDefinitionId)
				}
				onSubmit={(draft) =>
					onSubmitObjectDefinition(draft, handleValidate, values)
				}
				portletNamespace={portletNamespace}
				screenNavigationCategoryKey={screenNavigationCategoryKey}
			/>

			<ObjectNavigationTabs
				baseResourceURL={baseResourceURL}
				companyKeyValuePair={companyKeyValuePair}
				creationLanguageId={creationLanguageId}
				dbTableName={dbTableName}
				errors={errors}
				externalReferenceCode={externalReferenceCode}
				fieldDropdownItems={fieldDropdownItems}
				fieldId={fieldId}
				fieldsApiURL={fieldsApiURL}
				fieldsCreationMenu={fieldsCreationMenu}
				filterOperators={filterOperators}
				forbiddenChars={forbiddenChars}
				forbiddenLastChars={forbiddenLastChars}
				forbiddenNames={forbiddenNames}
				handleChange={handleChange}
				hasPublishObjectPermission={hasPublishObjectPermission}
				hasUpdateObjectDefinitionPermission={
					hasUpdateObjectDefinitionPermission
				}
				isApproved={isApproved}
				isDefaultStorageType={isDefaultStorageType}
				label={label}
				nonRelationshipObjectFieldsInfo={
					nonRelationshipObjectFieldsInfo
				}
				objectDefinitionId={objectDefinitionId}
				objectFieldId={objectFieldId}
				objectFieldTypes={objectFieldTypes}
				objectFields={objectFields}
				objectRelationshipId={objectRelationshipId}
				pluralLabel={pluralLabel}
				portletNamespace={portletNamespace}
				readOnly={readOnly}
				screenNavigationCategoryKey={screenNavigationCategoryKey}
				setValues={setValues}
				shortName={shortName}
				sidebarElements={sidebarElements}
				siteKeyValuePair={siteKeyValuePair}
				storageTypes={storageTypes}
				system={system}
				values={values}
				workflowStatusJSONArray={workflowStatusJSONArray}
			/>
		</>
	);
}
