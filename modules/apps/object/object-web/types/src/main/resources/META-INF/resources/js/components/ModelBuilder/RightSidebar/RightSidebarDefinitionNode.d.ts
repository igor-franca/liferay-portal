/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/// <reference types="react" />

import './RightSidebarDefinitionNode.scss';
import {KeyValuePair} from '../../ObjectDetails/EditObjectDetails';
interface RightSidebarDefinitionNode {
	companyKeyValuePair: KeyValuePair[];
	siteKeyValuePair: KeyValuePair[];
}
export declare function RightSidebarDefinitionNode({
	companyKeyValuePair,
	siteKeyValuePair,
}: RightSidebarDefinitionNode): JSX.Element;
export {};
