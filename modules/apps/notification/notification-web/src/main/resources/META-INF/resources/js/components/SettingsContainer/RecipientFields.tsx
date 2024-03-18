/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
	FormError,
	Input,
	SingleSelect,
} from '@liferay/object-js-components-web';
import {InputLocalized} from 'frontend-js-components-web';
import React from 'react';

import {NotificationTemplateError} from '../EditNotificationTemplate';

interface RecipientFieldsProps {
	errors: FormError<NotificationTemplate & NotificationTemplateError>;
	isBCC?: Boolean;
	isCC?: Boolean;
	selectedLocale: Locale;
	setValues: (values: Partial<NotificationTemplate>) => void;
	values: NotificationTemplate;
}

const RECIPIENT_OPTIONS = [
	{
		label: Liferay.Language.get('user-email'),
		value: 'email',
	},
] as LabelValueObject[];

export function RecipientFields({
	errors,
	isBCC,
	isCC,
	selectedLocale,
	setValues,
	values,
}: RecipientFieldsProps) {
	const isRequired = !isCC && !isBCC;

	return (
		<>
			{isCC || isBCC ? (
				<div className="row">
					<div className="col-lg-6">
						<SingleSelect<LabelValueObject>
							disabled={true}
							items={RECIPIENT_OPTIONS}
							label={Liferay.Language.get('type')}
							onSelectionChange={(value) => {
								setValues({
									...values,
									recipientType: value as string,
									recipients: [],
								});
							}}
							required={isRequired}
							selectedKey={values.recipientType}
						/>
					</div>

					<div className="col-lg-6">
						{values.recipientType === 'email' && isBCC && (
							<Input
								disabled={values.system}
								label={Liferay.Language.get('recipients')}
								name="bcc"
								onChange={({target}) =>
									setValues({
										...values,
										recipients: [
											{
												...values.recipients[0],
												bcc: target.value,
											},
										],
									})
								}
								placeholder={Liferay.Language.get(
									'type-email-adress'
								)}
								value={
									(values.recipients[0] as EmailRecipients)
										.bcc
								}
							/>
						)}

						{values.recipientType === 'email' && isCC && (
							<Input
								disabled={values.system}
								label={Liferay.Language.get('recipients')}
								name="cc"
								onChange={({target}) =>
									setValues({
										...values,
										recipients: [
											{
												...values.recipients[0],
												cc: target.value,
											},
										],
									})
								}
								placeholder={Liferay.Language.get(
									'type-email-adress'
								)}
								value={
									(values.recipients[0] as EmailRecipients).cc
								}
							/>
						)}
					</div>
				</div>
			) : (
				<>
					<SingleSelect<LabelValueObject>
						disabled={true}
						items={RECIPIENT_OPTIONS}
						label={Liferay.Language.get('type')}
						onSelectionChange={(value) => {
							setValues({
								...values,
								recipientType: value as string,
								recipients: [],
							});
						}}
						required={isRequired}
						selectedKey={values.recipientType}
					/>

					{values.recipientType === 'email' && (
						<InputLocalized
							disabled={values.system}
							error={errors.to}
							label={Liferay.Language.get('recipients')}
							name="recipients"
							onChange={(translation) => {
								setValues({
									...values,
									recipients: [
										{
											...values.recipients[0],
											to: translation,
										},
									],
								});
							}}
							placeholder={Liferay.Language.get(
								'type-email-adress'
							)}
							required
							selectedLocale={selectedLocale}
							translations={
								(values.recipients[0] as EmailRecipients).to
							}
						/>
					)}
				</>
			)}
		</>
	);
}

export default RecipientFields;
