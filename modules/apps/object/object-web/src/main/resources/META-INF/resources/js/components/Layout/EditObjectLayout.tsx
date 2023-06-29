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
import {
	API,
	SidePanelContent,
	invalidateRequired,
	openToast,
	saveAndReload,
} from '@liferay/object-js-components-web';
import React, {useEffect, useState} from 'react';

import {defaultLanguageId} from '../../utils/constants';
import InfoScreen from './InfoScreen/InfoScreen';
import LayoutScreen from './LayoutScreen/LayoutScreen';
import {
	normalizeObjectFields,
	normalizeObjectRelationships,
} from './layoutUtil';
import {
	LayoutContextProvider,
	TYPES,
	useLayoutContext,
} from './objectLayoutContext';

const LAYOUT_TABS = [
	{
		Component: InfoScreen,
		label: Liferay.Language.get('info'),
	},
	{
		Component: LayoutScreen,
		label: Liferay.Language.get('layout'),
	},
];

interface LayoutProps {
	closeVerticalbar: () => void;
}

function Layout({closeVerticalbar}: LayoutProps) {
	const [
		{objectFields, objectLayout, objectLayoutId, readOnly},
		dispatch,
	] = useLayoutContext();
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const makeFetch = async () => {
			const {
				defaultObjectLayout,
				name,
				objectDefinitionExternalReferenceCode,
				objectLayoutTabs,
			} = await API.fetchJSON<ObjectLayout>(
				`/o/object-admin/v1.0/object-layouts/${objectLayoutId}`
			);

			const objectDefinition = await API.getObjectDefinitionByExternalReferenceCode(
				objectDefinitionExternalReferenceCode
			);

			const objectFields = await API.getObjectFieldsByExternalReferenceCode(
				objectDefinitionExternalReferenceCode
			);

			const objectRelationships = await API.getObjectRelationshipsByExternalReferenceCode(
				objectDefinitionExternalReferenceCode
			);

			const objectLayout = {
				defaultObjectLayout,
				name,
				objectDefinitionExternalReferenceCode,
				objectLayoutTabs,
			};

			dispatch({
				payload: {
					creationLanguageId: objectDefinition.defaultLanguageId,
					enableCategorization: objectDefinition.enableCategorization,
					objectLayout,
					objectRelationships: normalizeObjectRelationships({
						objectLayoutTabs,
						objectRelationships,
					}),
				},
				type: TYPES.ADD_OBJECT_LAYOUT,
			});

			const filteredObjectFields = objectFields.filter(
				({system}) => !system
			);

			dispatch({
				payload: {
					objectFields: normalizeObjectFields({
						objectFields: filteredObjectFields,
						objectLayout,
					}),
				},
				type: TYPES.ADD_OBJECT_FIELDS,
			});

			setLoading(false);
		};

		makeFetch();
	}, [objectLayoutId, dispatch]);

	const saveObjectLayout = async () => {
		const hasFieldsInLayout = objectFields.some(
			(objectField) => objectField.inLayout
		);

		if (invalidateRequired(objectLayout?.name[defaultLanguageId])) {
			openToast({
				message: Liferay.Language.get('a-name-is-required'),
				type: 'danger',
			});

			return;
		}

		if (!hasFieldsInLayout) {
			openToast({
				message: Liferay.Language.get('please-add-at-least-one-field'),
				type: 'danger',
			});

			return;
		}

		if (objectLayout.objectLayoutTabs[0].objectRelationshipId > 0) {
			openToast({
				message: Liferay.Language.get(
					'the-layouts-first-tab-must-be-a-field-tab'
				),
				type: 'danger',
			});

			return;
		}

		try {
			await API.save(
				`/o/object-admin/v1.0/object-layouts/${objectLayoutId}`,
				objectLayout
			);
			saveAndReload();
			openToast({
				message: Liferay.Language.get(
					'the-object-layout-was-updated-successfully'
				),
			});
		}
		catch (error: unknown) {
			const {message} = error as Error;

			openToast({message, type: 'danger'});
		}
	};

	return (
		<SidePanelContent
			closeVerticalBar={closeVerticalbar}
			onSave={saveObjectLayout}
			readOnly={readOnly || loading}
			title={Liferay.Language.get('layout')}
		>
			<ClayTabs className="side-panel-iframe__tabs">
				{LAYOUT_TABS.map(({label}, index) => (
					<ClayTabs.Item
						active={activeIndex === index}
						key={index}
						onClick={() => setActiveIndex(index)}
					>
						{label}
					</ClayTabs.Item>
				))}
			</ClayTabs>

			<ClayTabs.Content activeIndex={activeIndex} fade>
				{LAYOUT_TABS.map(({Component}, index) => (
					<ClayTabs.TabPane key={index}>
						{!loading && <Component />}
					</ClayTabs.TabPane>
				))}
			</ClayTabs.Content>
		</SidePanelContent>
	);
}

interface EditObjectLayoutProps {
	closeVerticalbar: () => void;
	objectFieldTypes: ObjectFieldType[];
	objectLayoutId: number;
	readOnly: boolean;
}

export function EditObjectLayout({
	closeVerticalbar,
	objectFieldTypes,
	objectLayoutId,
	readOnly,
}: EditObjectLayoutProps) {
	return (
		<LayoutContextProvider
			value={{
				objectFieldTypes,
				objectLayoutId,
				readOnly,
			}}
		>
			<Layout closeVerticalbar={closeVerticalbar} />
		</LayoutContextProvider>
	);
}
