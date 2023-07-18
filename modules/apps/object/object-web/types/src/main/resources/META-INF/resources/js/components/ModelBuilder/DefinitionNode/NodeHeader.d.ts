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

import './NodeHeader.scss';
interface INodeHeader {
	hasDeleteResourcePermission: boolean;
	hasManagePermissionsResourcePermission: boolean;
	hasObjectDefinitionPublished: boolean;
	isLinkedNode: boolean;
	objectDefinitionLabel: string;
	system: boolean;
}
export default function NodeHeader({
	hasDeleteResourcePermission,
	hasManagePermissionsResourcePermission,
	hasObjectDefinitionPublished,
	isLinkedNode,
	objectDefinitionLabel,
	system,
}: INodeHeader): JSX.Element;
export {};
