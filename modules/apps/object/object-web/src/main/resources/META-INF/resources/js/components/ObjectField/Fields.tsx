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
import {FrontendDataSet} from '@liferay/frontend-data-set-web';
import {
	API,
	SidebarCategory,
	getLocalizableLabel,
} from '@liferay/object-js-components-web';
import classNames from 'classnames';
import {createResourceURL} from 'frontend-js-web';
import React, {useEffect, useState} from 'react';

import {defaultLanguageId} from '../../utils/constants';
import {IFDSTableProps, defaultDataSetProps, fdsItem} from '../../utils/fds';
import AddObjectField from './AddObjectField';
import EditObjectField from './EditObjectField';
import {ModalDeleteObjectField} from './ModalDeleteObjectField';
import {deleteObjectField} from './deleteObjectFieldUtil';

import './Fields.scss';

interface ItemData {
	id: number;
	required: boolean;
	system?: boolean;
}

interface FieldsProps extends IFDSTableProps {
	baseResourceURL: string;
	creationLanguageId: Liferay.Language.Locale;
	filterOperators: TFilterOperators;
	forbiddenChars: string[];
	forbiddenLastChars: string[];
	forbiddenNames: string[];
	isApproved: boolean;
	isDefaultStorageType: boolean;
	objectFieldTypes: ObjectFieldType[];
	objectName: string;
	readOnly: boolean;
	sidebarElements: SidebarCategory[];
	workflowStatusJSONArray: LabelValueObject[];
}

export default function Fields({
	apiURL,
	baseResourceURL,
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
	objectFieldTypes,
	objectName,
	readOnly,
	sidebarElements,
	workflowStatusJSONArray,
}: FieldsProps) {
	const [triggerSideBarAnimation, settriggerSideBarAnimation] = useState<
		boolean
	>(false);
	const [
		deletedObjectField,
		setDeletedObjectField,
	] = useState<ObjectField | null>(null);
	const [showAddModalField, setShowAddFieldModal] = useState<boolean>(false);
	const [showDeletionModal, setShowDeletionModal] = useState<boolean>(false);
	const [
		showDeletionNotAllowedModal,
		setShowDeletionNotAllowedModal,
	] = useState<boolean>(false);
	const [showVerticalBar, setShowVerticalBar] = useState<boolean>(false);
	const [objectFieldId, setObjetFieldId] = useState<number>();

	const sidePanelitems = [
		{
			title: 'editObjectFieldSideBar',
		},
	];

	useEffect(() => {
		Liferay.on('addObjectField', () => setShowAddFieldModal(true));

		return () => Liferay.detach('addObjectField');
	}, []);

	function closeVerticalBar() {
		settriggerSideBarAnimation(false);
		setTimeout(() => {
			setShowVerticalBar(false);
		}, 500);
	}

	function objectFieldLabelDataRenderer({
		itemData,
		value,
	}: fdsItem<ItemData>) {
		const handleEditField = () => {
			setShowVerticalBar(true);
			settriggerSideBarAnimation(true);
			setObjetFieldId(itemData.id);
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
			itemData: ObjectField;
		}) {
			if (action.data.id === 'deleteObjectField') {
				const makeFetch = async () => {
					const url = createResourceURL(baseResourceURL, {
						objectFieldId: itemData.id,
						p_p_resource_id:
							'/object_definitions/get_object_field_delete_info',
					}).href;
					const showModalResponse = await API.fetchJSON<{
						showDeletionModal: boolean;
						showDeletionNotAllowedModal: boolean;
					}>(url);

					if (showModalResponse.showDeletionModal) {
						setShowDeletionModal(
							showModalResponse.showDeletionModal
						);
						setShowDeletionNotAllowedModal(
							showModalResponse.showDeletionNotAllowedModal
						);
						setDeletedObjectField(itemData);

						return;
					}

					await deleteObjectField(
						defaultLanguageId,
						itemData.id,
						itemData
					);

					setTimeout(() => window.location.reload(), 1500);

					return;
				};

				makeFetch();
			}

			if (action.data.id === 'editObjectField') {
				setObjetFieldId(itemData.id);
				setShowVerticalBar(true);
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
			<FrontendDataSet {...dataSetProps} />
			{showVerticalBar && (
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
										objectDefinitionExternalReferenceCode={
											objectDefinitionExternalReferenceCode
										}
										objectFieldId={objectFieldId as number}
										objectFieldTypes={objectFieldTypes}
										objectName={objectName}
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

			{showAddModalField && (
				<AddObjectField
					apiURL={apiURL as string}
					creationLanguageId="ar_SA"
					objectDefinitionExternalReferenceCode={
						objectDefinitionExternalReferenceCode
					}
					objectFieldTypes={objectFieldTypes}
					objectName={objectName}
					onVisibilityChange={setShowAddFieldModal}
				/>
			)}

			{showDeletionModal && (
				<ModalDeleteObjectField
					objectField={deletedObjectField as ObjectField}
					setModalVisibility={setShowDeletionModal}
					setObjectField={setDeletedObjectField}
					showDeletionNotAllowedModal={showDeletionNotAllowedModal}
				/>
			)}
		</>
	);
}
