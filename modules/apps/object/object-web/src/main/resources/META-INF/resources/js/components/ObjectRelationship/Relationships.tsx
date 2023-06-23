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
import {	API,
	SidebarCategory,
	getLocalizableLabel,
} from '@liferay/object-js-components-web';
import classNames from 'classnames';
import {createResourceURL} from 'frontend-js-web';
import React, {useEffect, useState} from 'react';

import {
	IFDSTableProps,
	defaultDataSetProps,
	fdsItem,
	formatActionURL,
} from '../../utils/fds';
import AddRelationship from './AddRelationship';
import EditRelationship from './EditRelationship';

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
	hasUpdateObjectDefinitionPermission,
	ffOneToOneRelationshipConfigurationEnabled,
	formName,
	id,
	items,
	objectDefinitionExternalReferenceCode,
	objectRelationship,
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
	const [objectRelationshipId, setObjetRelationshipId] = useState<number>();

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

	function objectFieldLabelDataRenderer({
		itemData,
		value,
	}: fdsItem<ItemData>) {
		const handleEditField = () => {
			setShowVerticalBar(true);
			setTriggerSideBarAnimation(true);
			setObjetRelationshipId(itemData.id);
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
									<EditRelationship 
										deletionTypes={deletionTypes}
										hasUpdateObjectDefinitionPermission={hasUpdateObjectDefinitionPermission}
										objectRelationship={objectRelationship}
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
				<AddRelationship
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
