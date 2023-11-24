/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {SetStateAction} from 'react';
import {DropDownItems} from '../ModelBuilder/types';
import {DeletedObjectDefinition} from './ViewObjectDefinitions';
declare type DeleteObjectDefinitionProps = {
	baseResourceURL: string;
	handleShowDeleteObjectDefinitionModal: () => void;
	objectDefinitionId: number;
	objectDefinitionName: string;
	setDeletedObjectDefinition: (value: DeletedObjectDefinition) => void;
};
declare type ObjectDefinitionNodeActionsProps = {
	baseResourceURL: string;
	handleShowDeleteObjectDefinitionModal: () => void;
	handleShowEditObjectDefinitionExternalReferenceCodeModal: () => void;
	handleShowRedirectObjectDefinitionModal: () => void;
	hasObjectDefinitionDeleteResourcePermission: boolean;
	hasObjectDefinitionManagePermissionsResourcePermission: boolean;
	objectDefinitionId: number;
	objectDefinitionName: string;
	objectDefinitionPermissionsURL: string;
	setDeletedObjectDefinition: (value: DeletedObjectDefinition) => void;
	status: {
		code: number;
		label: string;
		label_i18n: string;
	};
};
export declare function deleteObjectFolder(
	id: number,
	objectFolderName: string
): Promise<void>;
export declare function deleteObjectDefinitionToast(
	id: number,
	objectDefinitionName: string
): Promise<void>;
export declare function deleteObjectDefinition({
	baseResourceURL,
	handleShowDeleteObjectDefinitionModal,
	objectDefinitionId,
	objectDefinitionName,
	setDeletedObjectDefinition,
}: DeleteObjectDefinitionProps): Promise<void>;
export declare function deleteRelationship(
	id: number,
	reloadAfterDeletion?: boolean
): Promise<void>;
export declare function getObjectDefinitionNodeActions({
	baseResourceURL,
	handleShowDeleteObjectDefinitionModal,
	handleShowEditObjectDefinitionExternalReferenceCodeModal,
	handleShowRedirectObjectDefinitionModal,
	hasObjectDefinitionDeleteResourcePermission,
	hasObjectDefinitionManagePermissionsResourcePermission,
	objectDefinitionId,
	objectDefinitionName,
	objectDefinitionPermissionsURL,
	setDeletedObjectDefinition,
}: ObjectDefinitionNodeActionsProps): DropDownItems[];
interface GetObjectFolderActionsProps {
	actions?: {
		objectDefinitionActions: Actions;
		objectFolderActions: Actions;
	};
	id: number;
	objectFolderPermissionsURL: string;
	setShowModal: (value: SetStateAction<ViewObjectDefinitionsModals>) => void;
	setShowModalImportObjectDefinition: (value: boolean) => void;
}
export declare function getObjectFolderActions({
	actions,
	id,
	objectFolderPermissionsURL,
	setShowModal,
	setShowModalImportObjectDefinition,
}: GetObjectFolderActionsProps): (
	| {
			label: string;
			onClick: () => void;
			symbolLeft: string;
			value: string;
			type?: undefined;
	  }
	| {
			type: string;
			label?: undefined;
			onClick?: undefined;
			symbolLeft?: undefined;
			value?: undefined;
	  }
	| {
			label: string;
			onClick: () => void;
			symbolLeft: string;
			value?: undefined;
			type?: undefined;
	  }
)[];
export declare function getUpdatedModelBuilderStructurePayload(
	currentObjectFolderName: string
): Promise<{
	objectFolders: ObjectFolder[];
	selectedObjectFolder: ObjectFolder;
}>;
export declare function normalizeName(str: string): string;
export {};
