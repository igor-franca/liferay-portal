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

import {VerticalBar} from '@clayui/core';
import {
	FrontendDataSet,

	// @ts-ignore

} from '@liferay/frontend-data-set-web';
import {
	API,
	SidebarCategory,
	getLocalizableLabel,
} from '@liferay/object-js-components-web';
import classNames from 'classnames';
import React, {useEffect, useState} from 'react';

import {IFDSTableProps, defaultDataSetProps, fdsItem} from '../../utils/fds';
import AddObjectField from './AddObjectField';
import EditObjectField from './EditObjectField';

import './Fields.scss';

interface ItemData {
	id: number;
	required: boolean;
	system?: boolean;
}

interface FieldsProps extends IFDSTableProps {
	objectFieldTypes: ObjectFieldType[];
	objectName: string;
	creationLanguageId: Liferay.Language.Locale;
	filterOperators: TFilterOperators;
	forbiddenChars: string[];
	forbiddenLastChars: string[];
	forbiddenNames: string[];
	isApproved: boolean;
	isDefaultStorageType: boolean;
	objectFieldId: number;
	objectRelationshipId: number;
	readOnly: boolean;
	readOnlySidebarElements: SidebarCategory[];
	sidebarElements: SidebarCategory[];
	workflowStatusJSONArray: LabelValueObject[];
}

export default function Fields({
	apiURL,
	creationLanguageId,
	creationMenu,
	filterOperators,
	forbiddenChars,
	forbiddenLastChars,
	forbiddenNames,
	formName,
	id,
	isApproved,
	isDefaultStorageType,
	items,
	objectDefinitionExternalReferenceCode,
	objectFieldId,
	objectFieldTypes,
	objectName,
	objectRelationshipId,
	readOnly,
	readOnlySidebarElements,
	sidebarElements,
	workflowStatusJSONArray,
}: FieldsProps) {
	const [isModalVisible, setModalVisible] = useState<boolean>(false);
	const [isVerticalBarVisible, setVerticalBarVisible] = useState<boolean>(
		false
	);
	const [triggerSideBarAnimation, settriggerSideBarAnimation] = useState<
		boolean
	>(false);

	const sidePanelitems = [
		{
			title: 'editObjectFieldSideBar',
		},
	];

	useEffect(() => {
		Liferay.on('addObjectField', () => setModalVisible(true));

		return () => Liferay.detach('addObjectField');
	}, []);

	function closeVerticalBar() {
		settriggerSideBarAnimation(false);
		setTimeout(() => {
			setVerticalBarVisible(false);
		}, 500);
	}

	function objectFieldLabelDataRenderer({value}: fdsItem<ItemData>) {
		const handleEditField = () => {
			setVerticalBarVisible(true);
			settriggerSideBarAnimation(true);
		};

		return (
			<div className="table-list-title">
				<a href="#" onClick={handleEditField}>
					{getLocalizableLabel(
						creationLanguageId as Liferay.Language.Locale,
						value
					)}
				</a>
			</div>
		);
	}

	function objectFieldSourceDataRenderer({itemData}: {itemData: ItemData}) {
		return (
			<strong
				className={classNames(
					itemData.system ? 'label-info' : 'label-warning',
					'label'
				)}
			>
				{itemData.system
					? Liferay.Language.get('system')
					: Liferay.Language.get('custom')}
			</strong>
		);
	}

	function objectFieldMandatoryDataRenderer({
		itemData,
	}: {
		itemData: ItemData;
	}) {
		return itemData.required
			? Liferay.Language.get('yes')
			: Liferay.Language.get('no');
	}

	const dataSetProps = {
		...defaultDataSetProps,
		apiURL,
		creationMenu,
		customDataRenderers: {
			objectFieldLabelDataRenderer,
			objectFieldMandatoryDataRenderer,
			objectFieldSourceDataRenderer,
		},
		formName,
		id,
		itemsActions: items,
		namespace:
			'_com_liferay_object_web_internal_object_definitions_portlet_ObjectDefinitionsPortlet_',
		onActionDropdownItemClick({
			action,
			itemData,
		}: {
			action: {data: {id: string}};
			itemData: {id: string};
		}) {
			if (action.data.id === 'deleteObjectField') {
				Liferay.fire('deleteObjectField', {itemData});
			}

			if (action.data.id === 'editObjectField') {
				setVerticalBarVisible(true);
				settriggerSideBarAnimation(true);
			}
		},
		portletId:
			'com_liferay_object_web_internal_object_definitions_portlet_ObjectDefinitionsPortlet',
		showManagementBar: true,
		showPagination: true,
		showSearch: true,
		style: 'fluid' as 'fluid',
		views: [
			{
				contentRenderer: 'table',
				label: 'Table',
				name: 'table',
				schema: {
					fields: [
						{
							contentRenderer: 'objectFieldLabelDataRenderer',
							expand: false,
							fieldName: 'label',
							label: Liferay.Language.get('label'),
							localizeLabel: true,
							sortable: false,
						},
						{
							expand: false,
							fieldName: 'businessType',
							label: Liferay.Language.get('type'),
							localizeLabel: true,
							sortable: false,
						},
						{
							contentRenderer: 'objectFieldMandatoryDataRenderer',
							expand: false,
							fieldName: 'mandatory',
							label: Liferay.Language.get('mandatory'),
							localizeLabel: true,
							sortable: false,
						},
						{
							contentRenderer: 'objectFieldSourceDataRenderer',
							expand: false,
							fieldName: 'source',
							label: Liferay.Language.get('source'),
							localizeLabel: true,
							sortable: false,
						},
					],
				},
				thumbnail: 'table',
			},
		],
	};

	return (
		<>
			<FrontendDataSet {...dataSetProps} />;
			{isVerticalBarVisible && (
				<VerticalBar
					className={classNames(
						triggerSideBarAnimation
							? 'lfr__edit-object-field-side-bar-open'
							: 'lfr__edit-object-field-side-bar-closed'
					)}
					defaultActive="editObjectFieldSideBar"
					defaultPanelWidth={1200}
					panelWidth={700}
					panelWidthMax={1200}
					panelWidthMin={150}
					position="right"
					resize
				>
					<div className="lfr__object-edit-field-side-panel">
						<VerticalBar.Content items={sidePanelitems}>
							{(item) => (
								<VerticalBar.Panel key={item.title}>
									<EditObjectField
										closeVerticalBar={closeVerticalBar}
										creationLanguageId={creationLanguageId}
										filterOperators={filterOperators}
										forbiddenChars={forbiddenChars}
										forbiddenLastChars={forbiddenLastChars}
										forbiddenNames={forbiddenNames}
										isApproved={isApproved}
										isDefaultStorageType={
											isDefaultStorageType
										}
										objectDefinitionExternalReferenceCode=""
										objectFieldId={objectFieldId}
										objectFieldTypes={objectFieldTypes}
										objectName={objectName}
										objectRelationshipId={
											objectRelationshipId
										}
										readOnly={readOnly}
										sidebarElements={sidebarElements}
										workflowStatusJSONArray={
											workflowStatusJSONArray
										}
									/>
								</VerticalBar.Panel>
							)}
						</VerticalBar.Content>
					</div>
				</VerticalBar>
			)}
			{isModalVisible && (
				<AddObjectField
					apiURL={apiURL as string}
					creationLanguageId="ar_SA"
					objectDefinitionExternalReferenceCode={
						objectDefinitionExternalReferenceCode
					}
					objectFieldTypes={objectFieldTypes}
					objectName={objectName}
					onVisibilityChange={setModalVisible}
				/>
			)}
		</>
	);
}
