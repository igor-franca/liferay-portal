/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Card, RadioField} from '@liferay/object-js-components-web';
import {InputLocalized} from 'frontend-js-components-web';
import React from 'react';

import {ObjectValidationErrors} from './useObjectValidationForm';

type ErrorMessageProps = {
	children: React.ReactNode;
	disabled: boolean;
	errors: ObjectValidationErrors;
	setValidation: (values: Partial<ObjectValidation>) => void;
	validation: Partial<ObjectValidation>;
};

export function ErrorMessage({
	children,
	disabled,
	errors,
	setValidation,
	validation,
}: ErrorMessageProps) {
	const outputValidationTypeArray = [
		{
			label: Liferay.Language.get('full-validation-form-summary'),
			value: 'fullValidation',
		},
		{
			label: Liferay.Language.get('partial-validation-inline-field'),
			value: 'partialValidation',
		},
	];

	return (
		<Card title={Liferay.Language.get('error-message')}>
			<InputLocalized
				disabled={disabled}
				error={errors.errorLabel}
				label={Liferay.Language.get('message')}
				onChange={(errorLabel) => setValidation({errorLabel})}
				placeholder={Liferay.Language.get('add-an-error-message')}
				required
				translations={validation.errorLabel!}
			/>

			<RadioField
				defaultValue={validation.outputType}
				inline={false}
				label={Liferay.Language.get('output-validation-type')}
				onChange={(value) => {
					if (value === 'fullValidation') {
						setValidation({
							objectValidationRuleSettings:
								validation.engine === 'composedKey'
									? validation.objectValidationRuleSettings?.filter(
											(objectValidationRuleSetting) =>
												objectValidationRuleSetting.name ===
												'keyObjectFieldExternalReferenceCode'
									  )
									: [],
							outputType: value as string,
						});

						return;
					}
					else if (
						value === 'partialValidation' &&
						validation.engine === 'composedKey'
					) {
						const outputObjectFieldExternalReferenceCode = validation.objectValidationRuleSettings?.map(
							(objectValidationRuleSetting) => {
								return {
									name:
										'outputObjectFieldExternalReferenceCode',
									value: objectValidationRuleSetting.value,
								};
							}
						) as ObjectValidationRuleSetting[];

						setValidation({
							objectValidationRuleSettings: validation.objectValidationRuleSettings?.concat(
								outputObjectFieldExternalReferenceCode
							),
							outputType: value as string,
						});

						return;
					}

					setValidation({
						outputType: value as string,
					});
				}}
				options={outputValidationTypeArray}
				popover={{
					alignPosition: 'top',
					content: Liferay.Language.get(
						'map-the-error-message-to-be-displayed-next-to-the-validated-field'
					),
					header: Liferay.Language.get('message-location'),
				}}
			/>

			{validation.outputType === 'partialValidation' && children}
		</Card>
	);
}
