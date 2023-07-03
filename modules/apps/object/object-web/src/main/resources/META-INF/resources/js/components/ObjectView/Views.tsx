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
	API,
	ObjectVerticalBar,
	getLocalizableLabel,
} from '@liferay/object-js-components-web';
import React, {useEffect, useState} from 'react';

import {IFDSTableProps, defaultDataSetProps, fdsItem} from '../../utils/fds';
import {ModalBasicWithFieldName} from '../ModalBasicWithFieldName';
import {EditObjectView} from './EditObjectView';

import './Views.scss';

interface ItemData {
	defaultObjectView: boolean;
	id: number;
}

interface ViewsProps extends IFDSTableProps {
	filterOperators: TFilterOperators;
	readOnly: boolean;
	workflowStatusJSONArray: LabelValueObject[];
}

const verticalBarItems = [
	{
		title: 'editObjectViewVerticalBar',
	},
];

export default function Views({
	apiURL,
	creationMenu,
	filterOperators,
	formName,
	id,
	items,
	objectDefinitionExternalReferenceCode,
	readOnly,
	workflowStatusJSONArray,
}: ViewsProps) {
	const [creationLanguageId, setCreationLanguageId] = useState<
		Liferay.Language.Locale
	>();
	const [showAddViewModal, setShowAddViewModal] = useState(false);
	const [editObjectViewId, setEditObjectViewId] = useState<number>();
	const [showVerticalBar, setShowVerticalBar] = useState<boolean>(false);
	const [triggerSideBarAnimation, settriggerSideBarAnimation] = useState<
		boolean
	>(false);

	function closeVerticalBar() {
		settriggerSideBarAnimation(false);
		setTimeout(() => {
			setShowVerticalBar(false);
		}, 500);
	}

	function objectLayoutLabelDataRenderer({
		itemData,
		value,
	}: fdsItem<ItemData>) {
		const handleEditField = () => {
			setEditObjectViewId(itemData.id);
			setShowVerticalBar(true);
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

	function objectLayoutDefaultDataRenderer({itemData}: {itemData: ItemData}) {
		return itemData.defaultObjectView
			? Liferay.Language.get('yes')
			: Liferay.Language.get('no');
	}

	useEffect(() => {
		Liferay.on('addObjectView', () => setShowAddViewModal(true));

		return () => {
			Liferay.detach('addObjectView');
		};
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

	const dataSetProps = {
		...defaultDataSetProps,
		apiURL,
		creationMenu,
		customDataRenderers: {
			objectLayoutDefaultDataRenderer,
			objectLayoutLabelDataRenderer,
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
			itemData: ObjectView;
		}) {
			if (action.data.id === 'editObjectView') {
				setEditObjectViewId(itemData.id);
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
							contentRenderer: 'objectLayoutLabelDataRenderer',
							expand: false,
							fieldName: 'name',
							label: Liferay.Language.get('label'),
							localizeLabel: true,
							sortable: false,
						},
						{
							contentRenderer: 'objectLayoutDefaultDataRenderer',
							expand: false,
							fieldName: 'defaultObjectLayout',
							label: Liferay.Language.get('default'),
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

			{showAddViewModal && (
				<ModalBasicWithFieldName
					apiURL={apiURL as string}
					label={Liferay.Language.get('new-view')}
					onVisibilityChange={setShowAddViewModal}
				/>
			)}

			{showVerticalBar && (
				<ObjectVerticalBar
					defaultActive="editObjectViewVerticalBar"
					triggerSideBarAnimation={triggerSideBarAnimation}
					verticalBaritems={verticalBarItems}
				>
					<EditObjectView
						filterOperators={filterOperators}
						isViewOnly={readOnly}
						objectDefinitionExternalReferenceCode={
							objectDefinitionExternalReferenceCode
						}
						objectViewId={editObjectViewId as number}
						onVerticalBarClose={closeVerticalBar}
						workflowStatusJSONArray={workflowStatusJSONArray}
					/>
				</ObjectVerticalBar>
			)}
		</>
	);
}
