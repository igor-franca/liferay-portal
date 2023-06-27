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

import {ClayRadio, ClayRadioGroup} from '@clayui/form';
import {
	Card,
	ExpressionBuilder,
	ExpressionBuilderModal,
	SidebarCategory,
} from '@liferay/object-js-components-web';
import React, {useMemo, useState} from 'react';

import {filterSideBarElements} from '../../../../utils/expressionBuilderUtil';
import {READ_ONLY_SIDE_BAR_ELEMENTS_MAP} from './readOnlyUtil';

interface ReadOnlyContainerProps {
	disabled?: boolean;
	readOnlySidebarElements: SidebarCategory[];
	requiredField: boolean;
	setValues: (value: Partial<ObjectField>) => void;
	values: Partial<ObjectField>;
}

export function ReadOnlyContainer({
	disabled,
	readOnlySidebarElements,
	requiredField,
	setValues,
	values,
}: ReadOnlyContainerProps) {
	const [
		showExpressionBuilderModal,
		setShowExpressionBuilderModal,
	] = useState(false);

	const setReadOnly = (value: ReadOnlyFieldValue) => {
		setValues({
			readOnly: value,
			required:
				value === 'true' || value === 'conditional'
					? false
					: requiredField,
		});
	};

	const filteredSideBarElements = useMemo(() => {
		return filterSideBarElements(
			readOnlySidebarElements,
			READ_ONLY_SIDE_BAR_ELEMENTS_MAP
		);
	}, [readOnlySidebarElements]);

	return (
		<>
			{values.readOnly && (
				<>
					<Card
						disabled={disabled}
						title={Liferay.Language.get('read-only')}
					>
						<ClayRadioGroup defaultValue={values?.readOnly}>
							<ClayRadio
								disabled={disabled}
								label={Liferay.Language.get('true')}
								onClick={() => setReadOnly('true')}
								value="true"
							/>

							<ClayRadio
								disabled={disabled}
								label={Liferay.Language.get('false')}
								onClick={() => setReadOnly('false')}
								value="false"
							/>

							<ClayRadio
								disabled={disabled}
								label={Liferay.Language.get('conditional')}
								onClick={() => setReadOnly('conditional')}
								value="conditional"
							/>
						</ClayRadioGroup>

						{values.readOnly === 'conditional' && (
							<ExpressionBuilder
								feedbackMessage={Liferay.Language.get(
									'use-expressions-to-create-a-condition'
								)}
								label={Liferay.Language.get(
									'expression-builder'
								)}
								onChange={({target: {value}}) => {
									setValues({
										readOnlyConditionExpression: value,
									});
								}}
								onOpenModal={() =>
									setShowExpressionBuilderModal(true)
								}
								placeholder={Liferay.Language.get(
									'create-an-expression'
								)}
								value={values.readOnlyConditionExpression ?? ''}
							/>
						)}
					</Card>

					{showExpressionBuilderModal && (
						<ExpressionBuilderModal
							header={Liferay.Language.get('expression-builder')}
							onCloseModal={() =>
								setShowExpressionBuilderModal(false)
							}
							onSave={(script: string) => {
								setValues({
									readOnlyConditionExpression: script,
								});
							}}
							placeholder={`<#-- ${Liferay.Language.get(
								'create-the-condition-of-the-read-only-state-using-expression-builder'
							)} -->`}
							sidebarElements={filteredSideBarElements}
							source={values.readOnlyConditionExpression ?? ''}
							validateExpressionURL=""
						/>
					)}
				</>
			)}
		</>
	);
}
