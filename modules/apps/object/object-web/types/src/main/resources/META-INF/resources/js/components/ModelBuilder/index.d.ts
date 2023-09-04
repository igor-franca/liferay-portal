/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';
import {KeyValuePair} from '../ObjectDetails/EditObjectDetails';
import {TDeletionType} from '../ObjectRelationship/EditRelationship';
interface CustomObjectFolderWrapperProps
	extends React.HTMLAttributes<HTMLElement> {
	baseResourceURL: string;
	companyKeyValuePair: KeyValuePair[];
	deletionTypes: TDeletionType[];
	editObjectDefinitionURL: string;
	filterOperators: TFilterOperators;
	forbiddenChars: string[];
	forbiddenLastChars: string[];
	forbiddenNames: string[];
	objectDefinitionPermissionsURL: string;
	objectWebLearnResources: ObjectWebLearnResources;
	siteKeyValuePair: KeyValuePair[];
	storages: LabelValueObject[];
	viewApiURL: string;
	workflowStatusJSONArray: LabelValueObject[];
}
declare const CustomObjectFolderWrapper: React.FC<CustomObjectFolderWrapperProps>;
export default CustomObjectFolderWrapper;
