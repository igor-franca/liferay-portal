/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/// <reference types="react" />

import {SidebarCategory} from './CodeEditor/index';
declare type Callback = (source?: string) => void;
interface ExpressionBuilderModalProps {
	error?: string;
	eventSidebarElements?: SidebarCategory[];
	header?: string;
	onSave?: Callback;
	placeholder?: string;
	required?: boolean;
	sidebarElements: SidebarCategory[];
	source?: string;
	validateExpressionURL?: string;
}
export declare function ExpressionBuilderModal({
	error,
	eventSidebarElements,
	header,
	onSave,
	placeholder,
	required,
	sidebarElements,
	source,
}: ExpressionBuilderModalProps): JSX.Element | null;
export {};
