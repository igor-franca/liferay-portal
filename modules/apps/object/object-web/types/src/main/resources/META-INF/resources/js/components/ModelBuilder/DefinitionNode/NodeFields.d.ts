/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/// <reference types="react" />

import './NodeFields.scss';
interface NodeFieldsProps {
	defaultLanguageId: Liferay.Language.Locale;
	objectFields: ObjectFieldNode[];
	selectedObjectDefinitionId: number;
	showAll: boolean;
}
export default function NodeFields({
	defaultLanguageId,
	objectFields,
	selectedObjectDefinitionId,
	showAll,
}: NodeFieldsProps): JSX.Element;
export {};
