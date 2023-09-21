/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/// <reference types="react" />

interface UniqueComposedKeyProps {
	creationLanguageId: Liferay.Language.Locale;
	objectFields: ObjectField[];
	setShowCUniqueComposedKeyCardAlert: (value: boolean) => void;
	setValues: (values: Partial<ObjectValidation>) => void;
	showCUniqueComposedKeyCardAlert: boolean;
	values: Partial<ObjectValidation>;
}
export declare function UniqueComposedKey({
	creationLanguageId,
	objectFields,
	setShowCUniqueComposedKeyCardAlert,
	setValues,
	showCUniqueComposedKeyCardAlert,
	values,
}: UniqueComposedKeyProps): JSX.Element;
export {};
