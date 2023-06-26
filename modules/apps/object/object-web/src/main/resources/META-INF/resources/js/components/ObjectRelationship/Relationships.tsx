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
	getLocalizableLabel,
} from '@liferay/object-js-components-web';
import classNames from 'classnames';
import {createResourceURL} from 'frontend-js-web';
import React, {useEffect, useState} from 'react';

import './Relationships.scss';
import {
	IFDSTableProps,
	defaultDataSetProps,
	fdsItem,
} from '../../utils/fds';
import EditRelationship from './EditRelationship';
import {ModalAddObjectRelationship} from './ModalAddObjectRelationship';

interface ItemData {
	id: number;
	reverse: boolean;
}

interface IRelationship extends IFDSTableProps {
	deletionTypes: any;
	ffOneToOneRelationshipConfigurationEnabled: boolean;
	hasUpdateObjectDefinitionPermission: boolean;
	objectRelationship: any;
	parameterEndpoint: any;
	parameterRequired: boolean;
}

export default function Relationships({
	apiURL,
	creationMenu,
	deletionTypes,
	ffOneToOneRelationshipConfigurationEnabled,
	formName,
	hasUpdateObjectDefinitionPermission,
	id,
	items,
	objectDefinitionExternalReferenceCode,
	parameterEndpoint,
	parameterRequired,
	style,
	url,
}: IRelationship) {
	const [isModalVisible, setModalVisible] = useState<boolean>(false);
	const [showVerticalBar, setShowVerticalBar] = useState<boolean>(false);

	const [triggerSideBarAnimation, setTriggerSideBarAnimation] = useState<
		boolean
	>(false);

	const [creationLanguageId, setCreationLanguageId] = useState<
		Liferay.Language.Locale
	>();
	const [objectRelationshipEdited, setObjectRelationshipEdited] = useState<
		ObjectRelationship
	>();

	const sidePanelitems = [
		{
			title: 'editObjectFieldSideBar',
		},
	];

	useEffect(() => {
		Liferay.on('addObjectRelationship', () => setModalVisible(true));

		return () => Liferay.detach('addObjectRelationship');
	}, []);

	useEffect(() => {
		const makeFetch = async () => {
			const objectDefinition = await API.getObjectDefinitionByExternalReferenceCode(
				objectDefinitionExternalReferenceCode
			);

			setCreationLanguageId(objectDefinition.defaultLanguageId);
		};

		makeFetch();
	}, [objectDefinitionExternalReferenceCode]);

	function ObjectFieldHierarchyDataRenderer({
		itemData,
	}: {
		itemData: ItemData;
	}) {
		return (
			<strong
				className={classNames(
					itemData.reverse ? 'label-info' : 'label-success',
					'label'
				)}
			>
				{itemData.reverse
					? Liferay.Language.get('child')
					: Liferay.Language.get('parent')}
			</strong>
		);
	}

	function closeVerticalBar() {
		setTriggerSideBarAnimation(false);
		setTimeout(() => {
			setShowVerticalBar(false);
		}, 500);
	}

	const handleEditField = (itemData: ObjectRelationship) => {
		setShowVerticalBar(true);
		setTriggerSideBarAnimation(true);
		setObjectRelationshipEdited(itemData);
	};

	function objectFieldLabelDataRenderer({
		itemData,
		value,
	}: fdsItem<ObjectRelationship>) {
		return (
			<div className="table-list-title">
				<a href="#" onClick={() => handleEditField(itemData)}>
					{getLocalizableLabel(
						creationLanguageId as Liferay.Language.Locale,
						value
					)}
				</a>
			</div>
		);
	}

	const dataSetProps = {
		...defaultDataSetProps,
		apiURL,
		creationMenu,
		customDataRenderers: {
			ObjectFieldHierarchyDataRenderer,
			objectFieldLabelDataRenderer,
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
			itemData: ObjectRelationship;
		}) {
			if (action.data.id === 'deleteObjectRelationship') {
				Liferay.fire('deleteObjectRelationship', {itemData});
			}

			if (action.data.id === 'editRelationship') {
				handleEditField(itemData);
			}
		},
		portletId:
			'com_liferay_object_web_internal_object_definitions_portlet_ObjectDefinitionsPortlet',
		style,
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
							fieldName: 'objectDefinitionName2',
							label: Liferay.Language.get('related-object'),
							localizeLabel: true,
							sortable: false,
						},
						{
							expand: false,
							fieldName: 'type',
							label: Liferay.Language.get('type'),
							localizeLabel: true,
							sortable: false,
						},
						{
							contentRenderer: 'ObjectFieldHierarchyDataRenderer',
							expand: false,
							fieldName: 'hierarchy',
							label: Liferay.Language.get('hierarchy'),
							localizeLabel: true,
							sortable: false,
						},
					],
				},
				style: 'fluid' as 'fluid',
				thumbnail: 'table',
			},
		],
	};

	return (
		<>
			<FrontendDataSet {...dataSetProps} />;
			{showVerticalBar && (
				<VerticalBar
					className={classNames(
						triggerSideBarAnimation
							? 'lfr__edit-object-relationship-side-bar-open'
							: 'lfr__edit-object-relationship-side-bar-closed'
					)}
					defaultActive="editObjectFieldSideBar"
					defaultPanelWidth={1200}
					panelWidth={700}
					panelWidthMax={1200}
					panelWidthMin={150}
					position="right"
					resize
				>
					<div className="lfr__object-edit-relationship-side-panel">
						<VerticalBar.Content items={sidePanelitems}>
							{(item) => (
								<VerticalBar.Panel key={item.title}>
									<EditRelationship
										deletionTypes={deletionTypes}
										hasUpdateObjectDefinitionPermission={
											hasUpdateObjectDefinitionPermission
										}
										objectRelationshipEdited={
											objectRelationshipEdited as ObjectRelationship
										}
										parameterEndpoint={parameterEndpoint}
										parameterRequired={parameterRequired}
									/>
								</VerticalBar.Panel>
							)}
						</VerticalBar.Content>
					</div>
				</VerticalBar>
			)}
			{isModalVisible && (
				<ModalAddObjectRelationship
					ffOneToOneRelationshipConfigurationEnabled={
						ffOneToOneRelationshipConfigurationEnabled
					}
					objectDefinitionExternalReferenceCode={
						objectDefinitionExternalReferenceCode
					}
					onVisibilityChange={setModalVisible}
					parameterRequired={parameterRequired}
				/>
			)}
		</>
	);
}
