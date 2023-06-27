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

import {
	Card,
	ExpressionBuilder,
	ExpressionBuilderModal,
	SidebarCategory,
} from '@liferay/object-js-components-web';
import React, {useMemo, useState} from 'react';

import {filterSideBarElements} from '../../../../utils/expressionBuilderUtil';
import {ObjectFieldErrors} from '../../ObjectFieldFormBase';
import {FORMULA_FIELD_SIDEBAR_ELEMENTS_MAP} from './formulaFieldUtil';

interface FormulaContainerProps {
	errors: ObjectFieldErrors;
	objectFieldSettings: ObjectFieldSetting[];
	setValues: (values: Partial<ObjectField>) => void;
	sidebarElements: SidebarCategory[];
}

const getNewObjectFieldSettings = (
	objectFieldSettings: ObjectFieldSetting[],
	script: string
) => {
	return [
		...(objectFieldSettings?.filter(
			(objectFieldSetting) => objectFieldSetting.name !== 'script'
		) as ObjectFieldSetting[]),
		{
			name: 'script',
			value: script,
		},
	] as ObjectFieldSetting[];
};

export function FormulaContainer({
	errors,
	objectFieldSettings,
	setValues,
	sidebarElements,
}: FormulaContainerProps) {
	const currentScript = objectFieldSettings?.find(
		(objectFieldSetting) => objectFieldSetting.name === 'script'
	);
	const [
		showExpressionBuilderModal,
		setShowExpressionBuilderModal,
	] = useState(false);

	const filteredSideBarElements = useMemo(() => {
		return filterSideBarElements(
			sidebarElements,
			FORMULA_FIELD_SIDEBAR_ELEMENTS_MAP
		);
	}, [sidebarElements]);

	return (
		<>
			<Card title={Liferay.Language.get('formula')}>
				<ExpressionBuilder
					error={errors.script}
					feedbackMessage={Liferay.Language.get(
						'use-expressions-to-create-a-condition'
					)}
					label={Liferay.Language.get('formula-builder')}
					onChange={({target: {value}}) => {
						setValues({
							objectFieldSettings: getNewObjectFieldSettings(
								objectFieldSettings,
								value
							),
						});
					}}
					onOpenModal={() => setShowExpressionBuilderModal(true)}
					placeholder={`${Liferay.Util.sub(
						Liferay.Language.get(
							'type-x-to-use-the-autocomplete-feature'
						),
						['"${"']
					)}`}
					value={(currentScript?.value as string) ?? ''}
				/>
			</Card>

			{showExpressionBuilderModal && (
				<ExpressionBuilderModal
					header={Liferay.Language.get('formula-builder')}
					onCloseModal={() => setShowExpressionBuilderModal(false)}
					onSave={(script: string) => {
						setValues({
							objectFieldSettings: getNewObjectFieldSettings(
								objectFieldSettings,
								script
							),
						});
					}}
					placeholder={`${Liferay.Util.sub(
						Liferay.Language.get(
							'type-x-to-use-the-autocomplete-feature'
						),
						['"${"']
					)}`}
					sidebarElements={filteredSideBarElements}
					source={(currentScript?.value as string) ?? ''}
					validateExpressionURL=""
				/>
			)}
		</>
	);
}
