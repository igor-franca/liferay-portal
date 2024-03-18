/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayForm, {ClayCheckbox} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayPanel from '@clayui/panel';
import {ClayTooltipProvider} from '@clayui/tooltip';
import {FormError, Input} from '@liferay/object-js-components-web';
import {InputLocalized} from 'frontend-js-components-web';
import React from 'react';

import './EmailNotificationSettings.scss';
import {NotificationTemplateError} from '../EditNotificationTemplate';
import RecipientFields from './RecipientFields';

interface EmailNotificationSettingsProps {
	errors: FormError<NotificationTemplate & NotificationTemplateError>;
	selectedLocale: Locale;
	setValues: (values: Partial<NotificationTemplate>) => void;
	values: NotificationTemplate;
}

export function EmailNotificationSettings({
	errors,
	selectedLocale,
	setValues,
	values,
}: EmailNotificationSettingsProps) {
	return (
		<>
			{Liferay.FeatureFlags['LPD-6604'] ? (
				<div className="lfr__notification-template-email-notification-settings">
					<ClayPanel
						displayTitle={Liferay.Language.get('sender')}
						displayType="unstyled"
					>
						<ClayPanel.Body>
							<div className="row">
								<div className="col-lg-6">
									<Input
										disabled={values.system}
										error={errors.from}
										label={Liferay.Language.get(
											'email-address'
										)}
										name="fromAddress"
										onChange={({target}) =>
											setValues({
												...values,
												recipients: [
													{
														...values.recipients[0],
														from: target.value,
													},
												],
											})
										}
										required
										value={
											(values
												.recipients[0] as EmailRecipients)
												.from
										}
									/>
								</div>

								<div className="col-lg-6">
									<InputLocalized
										disabled={values.system}
										error={errors.fromName}
										label={Liferay.Language.get('name')}
										name="fromName"
										onChange={(translation) => {
											setValues({
												...values,
												recipients: [
													{
														...values.recipients[0],
														fromName: translation,
													},
												],
											});
										}}
										placeholder=""
										required
										selectedLocale={selectedLocale}
										translations={
											(values
												.recipients[0] as EmailRecipients)
												.fromName
										}
									/>
								</div>
							</div>
						</ClayPanel.Body>
					</ClayPanel>

					<ClayPanel
						displayTitle={Liferay.Language.get(
							'primary-recipients'
						)}
						displayType="unstyled"
					>
						<ClayPanel.Body>
							<RecipientFields
								errors={errors}
								selectedLocale={selectedLocale}
								setValues={setValues}
								values={values}
							/>

							<ClayForm.Group className="ml-1 row">
								<div className="mr-2">
									<ClayCheckbox
										checked={
											(values
												.recipients[0] as EmailRecipients)
												.singleRecipient
										}
										disabled={values.system}
										label={Liferay.Language.get(
											'send-emails-separately'
										)}
										onChange={({target: {checked}}) => {
											setValues({
												...values,
												recipients: [
													{
														...values.recipients[0],
														singleRecipient: checked,
													},
												],
											});
										}}
									/>
								</div>

								<ClayTooltipProvider>
									<span
										title={Liferay.Language.get(
											'each-to-recipient-will-receive-separate-emails'
										)}
									>
										<ClayIcon
											className="lfr__notification-template-email-notification-settings-tooltip-icon"
											symbol="question-circle-full"
										/>
									</span>
								</ClayTooltipProvider>
							</ClayForm.Group>
						</ClayPanel.Body>
					</ClayPanel>

					<ClayPanel
						displayTitle={Liferay.Language.get(
							'secondary-recipients'
						)}
						displayType="unstyled"
					>
						<ClayPanel
							displayTitle={Liferay.Language.get('cc')}
							displayType="unstyled"
						>
							<ClayPanel.Body>
								<RecipientFields
									errors={errors}
									isCC={true}
									selectedLocale={selectedLocale}
									setValues={setValues}
									values={values}
								/>
							</ClayPanel.Body>
						</ClayPanel>

						<ClayPanel
							displayTitle={Liferay.Language.get('bcc')}
							displayType="unstyled"
						>
							<ClayPanel.Body>
								<RecipientFields
									errors={errors}
									isBCC={true}
									selectedLocale={selectedLocale}
									setValues={setValues}
									values={values}
								/>
							</ClayPanel.Body>
						</ClayPanel>
					</ClayPanel>
				</div>
			) : (
				<>
					<InputLocalized
						disabled={values.system}
						error={errors.to}
						label={Liferay.Language.get('to')}
						name="to"
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
						placeholder=""
						required
						selectedLocale={selectedLocale}
						translations={
							(values.recipients[0] as EmailRecipients).to
						}
					/>

					<ClayForm.Group className="ml-1 row">
						<div className="mr-2">
							<ClayCheckbox
								checked={
									(values.recipients[0] as EmailRecipients)
										.singleRecipient
								}
								disabled={values.system}
								label={Liferay.Language.get(
									'send-emails-separately'
								)}
								onChange={({target: {checked}}) => {
									setValues({
										...values,
										recipients: [
											{
												...values.recipients[0],
												singleRecipient: checked,
											},
										],
									});
								}}
							/>
						</div>

						<ClayTooltipProvider>
							<span
								title={Liferay.Language.get(
									'each-to-recipient-will-receive-separate-emails'
								)}
							>
								<ClayIcon
									className="lfr__notification-template-email-notification-settings-tooltip-icon"
									symbol="question-circle-full"
								/>
							</span>
						</ClayTooltipProvider>
					</ClayForm.Group>

					<div className="row">
						<div className="col-lg-6">
							<Input
								disabled={values.system}
								label={Liferay.Language.get('cc')}
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
								value={
									(values.recipients[0] as EmailRecipients).cc
								}
							/>
						</div>

						<div className="col-lg-6">
							<Input
								disabled={values.system}
								label={Liferay.Language.get('bcc')}
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
								value={
									(values.recipients[0] as EmailRecipients)
										.bcc
								}
							/>
						</div>
					</div>

					<div className="row">
						<div className="col-lg-6">
							<Input
								disabled={values.system}
								error={errors.from}
								label={Liferay.Language.get('from-address')}
								name="fromAddress"
								onChange={({target}) =>
									setValues({
										...values,
										recipients: [
											{
												...values.recipients[0],
												from: target.value,
											},
										],
									})
								}
								required
								value={
									(values.recipients[0] as EmailRecipients)
										.from
								}
							/>
						</div>

						<div className="col-lg-6">
							<InputLocalized
								disabled={values.system}
								error={errors.fromName}
								label={Liferay.Language.get('from-name')}
								name="fromName"
								onChange={(translation) => {
									setValues({
										...values,
										recipients: [
											{
												...values.recipients[0],
												fromName: translation,
											},
										],
									});
								}}
								placeholder=""
								required
								selectedLocale={selectedLocale}
								translations={
									(values.recipients[0] as EmailRecipients)
										.fromName
								}
							/>
						</div>
					</div>
				</>
			)}
		</>
	);
}
