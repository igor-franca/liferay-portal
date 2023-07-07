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
	ObjectVerticalBar,
	getLocalizableLabel,
} from '@liferay/object-js-components-web';
import React, {useEffect, useState} from 'react';

import {IFDSTableProps, defaultDataSetProps, fdsItem} from '../../utils/fds';
import {ModalBasicWithFieldName} from '../ModalBasicWithFieldName';
import {EditObjectLayout} from './EditObjectLayout';
import objectLayoutDefaultDataRenderer from './FDSDataRender/ObjectLayoutDefaultDataRenderer';

import './Layouts.scss';

interface LayoutsProps extends IFDSTableProps {
	creationLanguageId: Liferay.Language.Locale;
	objectFieldTypes: ObjectFieldType[];
	readOnly: boolean;
}

const verticalBarItems = [
	{
		title: 'editObjectLayoutVerticalBar',
	},
];

export default function Layouts({
	apiURL,
	creationLanguageId,
	creationMenu,
	formName,
	id,
	items,
	objectFieldTypes,
	readOnly,
}: LayoutsProps) {
	const [editObjectLayoutId, setEditObjectLayoutId] = useState<number>();
	const [showAddLayoutModal, setShowAddLayoutModal] = useState(false);
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
	}: fdsItem<ObjectLayout>) {
		const handleEditField = () => {
			setEditObjectLayoutId(itemData.id);
			setShowVerticalBar(true);
			settriggerSideBarAnimation(true);
		};

		return (
			<div className="table-list-title">
				<a href="#" onClick={handleEditField}>
					{getLocalizableLabel(creationLanguageId, value)}
				</a>
			</div>
		);
	}

	useEffect(() => {
		Liferay.on('addObjectLayout', () => setShowAddLayoutModal(true));

		return () => {
			Liferay.detach('addObjectLayout');
		};
	}, []);

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
			itemData: ObjectLayout;
		}) {
			if (action.data.id === 'editObjectLayout') {
				setEditObjectLayoutId(itemData.id);
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

			{showVerticalBar && (
				<ObjectVerticalBar
					defaultActive="editObjectLayoutVerticalBar"
					triggerSideBarAnimation={triggerSideBarAnimation}
					verticalBaritems={verticalBarItems}
				>
					<EditObjectLayout
						closeVerticalbar={closeVerticalBar}
						objectFieldTypes={objectFieldTypes}
						objectLayoutId={editObjectLayoutId as number}
						readOnly={readOnly as boolean}
					/>
				</ObjectVerticalBar>
			)}

			{showAddLayoutModal && (
				<ModalBasicWithFieldName
					apiURL={apiURL as string}
					label={Liferay.Language.get('new-layout')}
					onVisibilityChange={setShowAddLayoutModal}
				/>
			)}
		</>
	);
}
