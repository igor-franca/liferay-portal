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

import {API, ManagementToolbar} from '@liferay/object-js-components-web';
import React, {useEffect, useState} from 'react';

import {defaultLanguageId} from '../../utils/constants';
import {KeyValuePair} from '../ObjectDetails/EditObjectDetails';
import {ObjectNavigationTabs} from './ObjectDefinitionTabs/ObjectNavigationTabs';
import {onSubmitObjectDefinition} from './objectDefinitionUtil';
import {useObjectDefinitionForm} from './useObjectDefinitionForm';

interface EditObjectDefinitionProps {
	backURL: string;
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
	hasPublishObjectPermission: boolean;
	hasUpdateObjectDefinitionPermission: boolean;
	isApproved: boolean;
	label: LocalizedValue<string>;
	nonRelationshipObjectFieldsInfo: {
		label: LocalizedValue<string>;
		name: string;
	}[];
	objectDefinitionId: number;
	onSubmit: (draft: boolean) => void;
	pluralLabel: LocalizedValue<string>;
	portletNamespace: string;
	screenNavigationCategoryKey: string;
	setValues: (values: Partial<ObjectDefinition>) => void;
	shortName: string;
	siteKeyValuePair: KeyValuePair[];
	storageTypes: LabelValueObject[];
	system: boolean;
}

export default function EditObjectDefinition({
	backURL,
	companyKeyValuePair,
	dbTableName,
	externalReferenceCode,
	fieldDropdownItems,
	fieldId,
	fieldUrl,
	fieldsApiURL,
	fieldsCreationMenu,
	hasPublishObjectPermission,
	hasUpdateObjectDefinitionPermission,
	isApproved,
	label,
	nonRelationshipObjectFieldsInfo,
	objectDefinitionId,
	pluralLabel,
	portletNamespace,
	screenNavigationCategoryKey,
	shortName,
	siteKeyValuePair,
	storageTypes,
	system,
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
				companyKeyValuePair={companyKeyValuePair}
				dbTableName={dbTableName}
				errors={errors}
				externalReferenceCode={externalReferenceCode}
				fieldDropdownItems={fieldDropdownItems}
				fieldId={fieldId}
				fieldUrl={fieldUrl}
				fieldsApiURL={fieldsApiURL}
				fieldsCreationMenu={fieldsCreationMenu}
				handleChange={handleChange}
				hasPublishObjectPermission={hasPublishObjectPermission}
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
				screenNavigationCategoryKey={screenNavigationCategoryKey}
				setValues={setValues}
				shortName={shortName}
				siteKeyValuePair={siteKeyValuePair}
				storageTypes={storageTypes}
				system={system}
				values={values}
			/>
		</>
	);
}
