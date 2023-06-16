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
import {FormError} from '@liferay/object-js-components-web';
import React, {useState} from 'react';

import './ObjectNavigationTabs.scss';
import EditObjectDetails, {
	KeyValuePair,
} from '../../ObjectDetails/EditObjectDetails';
import Fields from '../../ObjectField/Fields';

interface ObjectNavigationProps {
	companyKeyValuePair: KeyValuePair[];
	dbTableName: string;
	errors: FormError<ObjectDefinition>;
	externalReferenceCode: string;
	fieldDropdownItems: [];
	fieldId: string;
	fieldUrl: string;
	fieldsApiURL: string;
	fieldsCreationMenu: {
		primaryItems?: any[];
		secondaryItems?: any[];
	};
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

export function ObjectNavigationTabs({
	companyKeyValuePair,
	dbTableName,
	errors,
	externalReferenceCode,
	fieldDropdownItems,
	fieldId,
	fieldUrl,
	fieldsApiURL,
	fieldsCreationMenu,
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
}: ObjectNavigationProps) {
	const [active, setActive] = useState(0);

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
				</ClayTabs>
			</div>

			<ClayTabs.Content activeIndex={active} fade>
				<ClayTabs.TabPane aria-labelledby="tab-1">
					<EditObjectDetails
						companyKeyValuePair={companyKeyValuePair}
						dbTableName={dbTableName}
						errors={errors}
						externalReferenceCode={externalReferenceCode}
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
						creationMenu={fieldsCreationMenu}
						id={fieldId}
						items={fieldDropdownItems}
						objectDefinitionExternalReferenceCode={
							externalReferenceCode
						}
						url={fieldUrl}
					/>
				</ClayTabs.TabPane>
			</ClayTabs.Content>
		</>
	);
}
