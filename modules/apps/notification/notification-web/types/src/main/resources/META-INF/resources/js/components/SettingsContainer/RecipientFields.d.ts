/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/// <reference types="react" />

import {FormError} from '@liferay/object-js-components-web';
import {NotificationTemplateError} from '../EditNotificationTemplate';
interface RecipientFieldsProps {
	errors: FormError<NotificationTemplate & NotificationTemplateError>;
	isBCC?: Boolean;
	isCC?: Boolean;
	selectedLocale: Locale;
	setValues: (values: Partial<NotificationTemplate>) => void;
	values: NotificationTemplate;
}
export declare function RecipientFields({
	errors,
	isBCC,
	isCC,
	selectedLocale,
	setValues,
	values,
}: RecipientFieldsProps): JSX.Element;
export default RecipientFields;
