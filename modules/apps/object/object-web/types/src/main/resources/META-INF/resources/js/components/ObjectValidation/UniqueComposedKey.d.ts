/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/// <reference types="react" />

interface UniqueComposedKeyProps {
	showCUniqueComposedKeyCardAlert: boolean;
	setShowCUniqueComposedKeyCardAlert: (value: boolean) => void;
}
export declare function UniqueComposedKey({
	showCUniqueComposedKeyCardAlert,
	setShowCUniqueComposedKeyCardAlert,
}: UniqueComposedKeyProps): JSX.Element;
export {};
