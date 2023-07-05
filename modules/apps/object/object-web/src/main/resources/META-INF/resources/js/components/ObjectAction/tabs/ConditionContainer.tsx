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

import {ActionError} from '..';
import ClayForm from '@clayui/form';
import {
	Card,
	ExpressionBuilder,
	ExpressionBuilderModal,
	SidebarCategory,
	Toggle,
} from '@liferay/object-js-components-web';
import React, {useState} from 'react';

interface ConditionContainerProps {
	errors: ActionError;
	objectActionCodeEditorElements: SidebarCategory[];
	setValues: (values: Partial<ObjectAction>) => void;
	validateExpressionURL: string;
	values: Partial<ObjectAction>;
}

export function ConditionContainer({
	errors,
	objectActionCodeEditorElements,
	setValues,
	validateExpressionURL,
	values,
}: ConditionContainerProps) {
	const handleSaveCondition = (conditionExpression?: string) => {
		setValues({conditionExpression});
	};

	const [
		showExpressionBuilderModal,
		setShowExpressionBuilderModal,
	] = useState(false);

	return (
		<>
			<Card
				disabled={values.objectActionTriggerKey === 'standalone'}
				title={Liferay.Language.get('condition')}
			>
				<ClayForm.Group>
					<Toggle
						disabled={
							values.objectActionTriggerKey === 'standalone'
						}
						label={Liferay.Language.get('enable-condition')}
						name="condition"
						onToggle={(enable) =>
							setValues({
								conditionExpression: enable ? '' : undefined,
							})
						}
						toggled={!(values.conditionExpression === undefined)}
					/>
				</ClayForm.Group>

				{values.conditionExpression !== undefined && (
					<ExpressionBuilder
						error={errors.conditionExpression}
						feedbackMessage={Liferay.Language.get(
							'use-expressions-to-create-a-condition'
						)}
						label={Liferay.Language.get('expression-builder')}
						name="conditionExpression"
						onChange={({target: {value}}) =>
							setValues({conditionExpression: value})
						}
						onOpenModal={() => setShowExpressionBuilderModal(true)}
						placeholder={Liferay.Language.get(
							'create-an-expression'
						)}
						value={values.conditionExpression}
					/>
				)}
			</Card>

			{showExpressionBuilderModal && (
				<ExpressionBuilderModal
					header={Liferay.Language.get('expression-builder')}
					onCloseModal={() => setShowExpressionBuilderModal(false)}
					onSave={handleSaveCondition}
					placeholder={`${Liferay.Util.sub(
						Liferay.Language.get(
							'type-x-to-use-the-autocomplete-feature'
						),
						['"${"']
					)}`}
					sidebarElements={objectActionCodeEditorElements}
					source={values.conditionExpression}
					validateExpressionURL={validateExpressionURL}
				/>
			)}
		</>
	);
}
