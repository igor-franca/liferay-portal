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

import {FrontendDataSet} from '@liferay/frontend-data-set-web';
import {
	CustomItem,
	ObjectVerticalBar,
	SidebarCategory,
	getLocalizableLabel,
} from '@liferay/object-js-components-web';
import React, {useEffect, useState} from 'react';

import {IFDSTableProps, defaultDataSetProps, fdsItem} from '../../utils/fds';
import AddObjectAction from './AddObjectAction';
import EditObjectAction from './EditObjectAction';
import objectActionActiveDataRenderer from './FDSDataRenders/ObjectActionActiveDataRenderer';
import objectActionLastExecutionDataRenderer from './FDSDataRenders/ObjectActionLastExecutionDataRenderer';

interface ObjectActionProps extends IFDSTableProps {
	creationLanguageId: Liferay.Language.Locale;
	isApproved: boolean;
	objectActionExecutors: CustomItem[];
	objectActionTriggers: CustomItem[];
	objectDefinitionExternalReferenceCode: string;
	objectDefinitionId: number;
	objectDefinitionsRelationshipsURL: string;
	readOnly?: boolean;
	sidebarElements: SidebarCategory[];
	systemObject: boolean;
	validateActionExpressionURL: string;
}

export default function Actions({
	apiURL,
	creationLanguageId,
	creationMenu,
	formName,
	id,
	isApproved,
	items,
	objectActionExecutors,
	objectActionTriggers,
	objectDefinitionExternalReferenceCode,
	objectDefinitionId,
	objectDefinitionsRelationshipsURL,
	readOnly,
	sidebarElements,
	systemObject,
	validateActionExpressionURL,
}: ObjectActionProps) {
	const [showVerticalBar, setShowVerticalBar] = useState<boolean>(false);
	const [newObjectAction, setNewObjectAction] = useState<boolean>(false);
	const [triggerSideBarAnimation, settriggerSideBarAnimation] = useState<
		boolean
	>(false);
	const [objectAction, setObjectAction] = useState<Partial<ObjectAction>>();

	const verticalBarItems = [
		{
			title: 'editObjectActionSideBar',
		},
	];

	function closeVerticalBar() {
		settriggerSideBarAnimation(false);
		setTimeout(() => {
			setShowVerticalBar(false);
			setNewObjectAction(false);
		}, 500);
	}

	useEffect(() => {
		Liferay.on('addObjectAction', () => {
			settriggerSideBarAnimation(true);
			setShowVerticalBar(true);
			setNewObjectAction(true);
		});

		return () => {
			Liferay.detach('addObjectAction');
		};
	}, []);

	function objectActionLabelDataRenderer({
		itemData,
		value,
	}: fdsItem<ObjectAction>) {
		const handleEditAction = () => {
			setObjectAction(itemData);
			setNewObjectAction(false);
			setShowVerticalBar(true);
			settriggerSideBarAnimation(true);
		};

		return (
			<div className="table-list-title">
				<a href="#" onClick={handleEditAction}>
					{getLocalizableLabel(creationLanguageId, value)}
				</a>
			</div>
		);
	}

	const dataSetProps = {
		...defaultDataSetProps,
		apiURL,
		creationMenu,
		customDataRenderers: {
			objectActionActiveDataRenderer,
			objectActionLabelDataRenderer,
			objectActionLastExecutionDataRenderer,
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
			if (action.data.id === 'editObjectAction') {
				setObjectAction(itemData);
				setNewObjectAction(false);
				setShowVerticalBar(true);
				settriggerSideBarAnimation(true);
			}
		},
		portletId:
			'com_liferay_object_web_internal_object_definitions_portlet_ObjectDefinitionsPortlet',
		style: 'fluid' as 'fluid',
		views: [
			{
				contentRenderer: 'table',
				label: 'Table',
				name: 'table',
				schema: {
					fields: [
						{
							contentRenderer: 'objectActionLabelDataRenderer',
							expand: false,
							fieldName: 'label',
							label: Liferay.Language.get('label'),
							localizeLabel: true,
							sortable: false,
						},
						{
							expand: false,
							fieldName: 'description',
							label: Liferay.Language.get('description'),
							localizeLabel: true,
							sortable: false,
						},
						{
							contentRenderer: 'objectActionActiveDataRenderer',
							expand: false,
							fieldName: 'active',
							label: Liferay.Language.get('active'),
							localizeLabel: true,
							sortable: false,
						},
						{
							contentRenderer:
								'objectActionLastExecutionDataRenderer',
							expand: false,
							fieldName: 'status',
							label: Liferay.Language.get('last-execution'),
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
				<ObjectVerticalBar
					defaultActive="editObjectActionSideBar"
					triggerSideBarAnimation={triggerSideBarAnimation}
					verticalBaritems={verticalBarItems}
				>
					{newObjectAction ? (
						<AddObjectAction
							apiURL={apiURL as string}
							closeVerticalBar={closeVerticalBar}
							objectActionCodeEditorElements={sidebarElements}
							objectActionExecutors={objectActionExecutors}
							objectActionTriggers={objectActionTriggers}
							objectDefinitionExternalReferenceCode={
								objectDefinitionExternalReferenceCode
							}
							objectDefinitionId={objectDefinitionId}
							objectDefinitionsRelationshipsURL={
								objectDefinitionsRelationshipsURL
							}
							systemObject={systemObject}
							validateExpressionURL={validateActionExpressionURL}
						/>
					) : (
						<EditObjectAction
							closeVerticalBar={closeVerticalBar}
							isApproved={isApproved}
							objectAction={objectAction as ObjectAction}
							objectActionCodeEditorElements={sidebarElements}
							objectActionExecutors={objectActionExecutors}
							objectActionTriggers={objectActionTriggers}
							objectDefinitionExternalReferenceCode={
								objectDefinitionExternalReferenceCode
							}
							objectDefinitionId={objectDefinitionId}
							objectDefinitionsRelationshipsURL={
								objectDefinitionsRelationshipsURL
							}
							readOnly={readOnly}
							systemObject={systemObject}
							validateExpressionURL={validateActionExpressionURL}
						/>
					)}
				</ObjectVerticalBar>
			)}
		</>
	);
}
