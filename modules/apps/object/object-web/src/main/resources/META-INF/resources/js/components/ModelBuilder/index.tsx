/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';
import {ReactFlowProvider} from 'react-flow-renderer';

import {KeyValuePair} from '../ObjectDetails/EditObjectDetails';
import {TDeletionType} from '../ObjectRelationship/EditRelationship';
import EditObjectFolder from './EditObjectFolder';
import {FolderContextProvider} from './ModelBuilderContext/objectFolderContext';
interface ICustomFolderWrapperProps extends React.HTMLAttributes<HTMLElement> {
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

const CustomFolderWrapper: React.FC<ICustomFolderWrapperProps> = ({
	baseResourceURL,
	companyKeyValuePair,
	deletionTypes,
	editObjectDefinitionURL,
	filterOperators,
	forbiddenChars,
	forbiddenLastChars,
	forbiddenNames,
	objectDefinitionPermissionsURL,
	objectWebLearnResources,
	siteKeyValuePair,
	storages,
	viewApiURL,
	workflowStatusJSONArray,
}) => {
	const urlParams = new URLSearchParams(window.location.search);
	const folderName = urlParams.get('folderName');

	return (
		<ReactFlowProvider>
			<FolderContextProvider
				value={{
					baseResourceURL,
					editObjectDefinitionURL,
					filterOperators,
					forbiddenChars,
					forbiddenLastChars,
					forbiddenNames,
					objectDefinitionPermissionsURL,
					objectWebLearnResources,
					storages,
					viewApiURL,
					workflowStatusJSONArray,
				}}
			>
				<EditObjectFolder
					companyKeyValuePair={companyKeyValuePair}
					deletionTypes={deletionTypes}
					folderName={folderName ?? ''}
					siteKeyValuePair={siteKeyValuePair}
				/>
			</FolderContextProvider>
		</ReactFlowProvider>
	);
};

export default CustomFolderWrapper;
