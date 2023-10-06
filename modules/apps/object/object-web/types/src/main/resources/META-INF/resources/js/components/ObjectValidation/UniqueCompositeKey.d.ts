/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/// <reference types="react" />

export interface UniqueCompositeKeyProps {
	creationLanguageId: Liferay.Language.Locale;
	customObjectField: ObjectField[];
	setShowUniqueCompositeKeyCardAlert: (value: boolean) => void;
	setValues: (values: Partial<ObjectValidation>) => void;
	showUniqueCompositeKeyCardAlert: boolean;
	values: Partial<ObjectValidation>;
}
export declare function UniqueCompositeKey({
	creationLanguageId,
	customObjectField,
	setShowUniqueCompositeKeyCardAlert,
	setValues,
	showUniqueCompositeKeyCardAlert,
	values,
}: UniqueCompositeKeyProps): JSX.Element;
