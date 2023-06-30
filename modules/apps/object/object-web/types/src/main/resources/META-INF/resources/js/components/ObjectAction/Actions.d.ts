/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

/// <reference types="react" />

import {CustomItem, SidebarCategory} from '@liferay/object-js-components-web';
import {IFDSTableProps} from '../../utils/fds';
interface ObjectActionProps extends IFDSTableProps {
	creationLanguageId: Liferay.Language.Locale;
	isApproved: boolean;
	objectActionExecutors: CustomItem[];
	objectActionTriggers: CustomItem[];
	objectDefinitionExternalReferenceCode: string;
	objectDefinitionId: number;
	objectDefinitionsRelationshipsURL: string;
	readOnly?: boolean;
	sidebarElements: SidebarCategory[];
	systemObject: boolean;
	validateActionExpressionURL: string;
}
export default function Actions({
	apiURL,
	creationLanguageId,
	creationMenu,
	formName,
	id,
	isApproved,
	items,
	objectActionExecutors,
	objectActionTriggers,
	objectDefinitionExternalReferenceCode,
	objectDefinitionId,
	objectDefinitionsRelationshipsURL,
	readOnly,
	sidebarElements,
	systemObject,
	validateActionExpressionURL,
}: ObjectActionProps): JSX.Element;
export {};
