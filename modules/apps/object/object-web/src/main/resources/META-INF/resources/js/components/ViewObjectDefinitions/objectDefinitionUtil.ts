/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {API, getLocalizableLabel} from '@liferay/object-js-components-web';
import {createResourceURL, openModal, sub} from 'frontend-js-web';
import {SetStateAction} from 'react';

import {formatActionURL} from '../../utils/fds';
import {
	firstLetterUppercase,
	removeAllSpecialCharacters,
} from '../../utils/string';
import {DropDownItems} from '../ModelBuilder/types';
import {DeletedObjectDefinition} from './ViewObjectDefinitions';

type DefinitionNodeActionsProps = {
	baseResourceURL: string;
	handleShowDeleteModal: () => void;
	handleShowEditERCModal: () => void;
	handleShowRedirectModal: () => void;
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

type DeleteObjectDefinitionProps = {
	baseResourceURL: string;
	handleShowDeleteModal: () => void;
	objectDefinitionId: number;
	objectDefinitionName: string;
	setDeletedObjectDefinition: (value: DeletedObjectDefinition) => void;
	status: string;
};

type FolderAction = {
	href: string;
	method: string;
};

type FolderActions = {
	delete?: FolderAction;
	get?: FolderAction;
	permissions?: FolderAction;
	update?: FolderAction;
};

export async function deleteFolder(id: number, folderName: string) {
	await API.deleteFolder(Number(id)).then(() => {
		Liferay.Util.openToast({
			message: sub(
				Liferay.Language.get('x-was-deleted-successfully'),
				`<strong>${folderName}</strong>`
			),
		});
	});
}

export async function deleteObjectDefinitionToast(
	id: number,
	objectDefinitionName: string
) {
	await API.deleteObjectDefinitions(Number(id)).then(() => {
		Liferay.Util.openToast({
			message: sub(
				Liferay.Language.get('x-was-deleted-successfully'),
				`<strong>${objectDefinitionName}</strong>`
			),
		});
	});
}

export async function deleteObjectDefinition({
	baseResourceURL,
	handleShowDeleteModal,
	objectDefinitionId,
	objectDefinitionName,
	setDeletedObjectDefinition,
	status,
}: DeleteObjectDefinitionProps) {
	const url = createResourceURL(baseResourceURL, {
		objectDefinitionId,
		p_p_resource_id:
			'/object_definitions/get_object_definition_delete_info',
	}).href;

	const {hasObjectRelationship, objectEntriesCount} = await API.fetchJSON<{
		hasObjectRelationship: boolean;
		objectEntriesCount: number;
	}>(url);

	if (status !== 'approved') {
		await deleteObjectDefinitionToast(
			objectDefinitionId,
			objectDefinitionName
		);
		setTimeout(() => window.location.reload(), 1000);

		return;
	}

	setDeletedObjectDefinition({
		...{id: objectDefinitionId, name: objectDefinitionName},
		hasObjectRelationship,
		objectEntriesCount,
	});

	handleShowDeleteModal();
}

export async function deleteRelationship(id: number) {
	try {
		await API.deleteObjectRelationships(id);

		Liferay.Util.openToast({
			message: Liferay.Language.get(
				'relationship-was-deleted-successfully'
			),
		});
	}
	catch (error) {
		Liferay.Util.openToast({
			message: (error as Error).message,
			type: 'danger',
		});
	}
}

export function getDefinitionNodeActions({
	baseResourceURL,
	handleShowDeleteModal,
	handleShowEditERCModal,
	handleShowRedirectModal,
	hasObjectDefinitionDeleteResourcePermission,
	hasObjectDefinitionManagePermissionsResourcePermission,
	objectDefinitionId,
	objectDefinitionName,
	objectDefinitionPermissionsURL,
	setDeletedObjectDefinition,
	status,
}: DefinitionNodeActionsProps) {
	const PermissionUrl = formatActionURL(
		objectDefinitionPermissionsURL,
		objectDefinitionId
	);

	const handleClickDeleteObjectDefinition = (event: React.MouseEvent) => {
		event.stopPropagation();
		deleteObjectDefinition({
			baseResourceURL,
			handleShowDeleteModal,
			objectDefinitionId,
			objectDefinitionName,
			setDeletedObjectDefinition,
			status: status.label,
		});
	};

	const handleClickManagePermissions = (event: React.MouseEvent) => {
		event.stopPropagation();
		openModal({
			title: Liferay.Language.get('permissions'),
			url: PermissionUrl,
		});
	};

	const kebabOptions = [
		{
			label: sub(
				Liferay.Language.get('edit-in-x'),
				Liferay.Language.get('page view')
			),
			onClick: (event: Event) => {
				event.stopPropagation();
				handleShowRedirectModal();
			},
			symbolRight: 'shortcut',
		},
		{
			label: sub(
				Liferay.Language.get('edit-x'),
				Liferay.Language.get('erc')
			),
			onClick: (event: Event) => {
				event.stopPropagation();
				handleShowEditERCModal();
			},
			symbolLeft: 'info-panel-closed',
		},
		{type: 'divider'},
	] as DropDownItems[];

	if (hasObjectDefinitionManagePermissionsResourcePermission) {
		kebabOptions.push({
			label: sub(
				Liferay.Language.get('manage-x'),
				Liferay.Language.get('permissions')
			),
			onClick: handleClickManagePermissions,
			symbolLeft: 'users',
		});
	}

	if (hasObjectDefinitionDeleteResourcePermission) {
		kebabOptions.push({type: 'divider'});
		kebabOptions.push({
			label: sub(
				Liferay.Language.get('delete-x'),
				Liferay.Language.get('object')
			),
			onClick: handleClickDeleteObjectDefinition,
			symbolLeft: 'trash',
		});
	}

	return kebabOptions;
}

export function getFolderActions(
	id: number,
	objectFolderPermissionsURL: string,
	setShowModal: (value: SetStateAction<ViewObjectDefinitionsModals>) => void,
	actions?: FolderActions
) {
	const url = formatActionURL(objectFolderPermissionsURL, id);
	const kebabOptions = [];

	if (actions?.update) {
		kebabOptions.unshift({type: 'divider'});
		kebabOptions.unshift({
			label: Liferay.Language.get('edit-label-and-erc'),
			onClick: () =>
				setShowModal((previousState: ViewObjectDefinitionsModals) => ({
					...previousState,
					editObjectFolder: true,
				})),
			symbolLeft: 'pencil',
			value: 'editFolder',
		});
	}

	if (actions?.permissions) {
		kebabOptions.push({
			label: Liferay.Language.get('folder-permissions'),
			onClick: () => {
				openModal({
					title: Liferay.Language.get('permissions'),
					url,
				});
			},
			symbolLeft: 'password-policies',
			value: 'folderPermissions',
		});
	}

	if (actions?.delete) {
		kebabOptions.push({type: 'divider'});
		kebabOptions.push({
			label: Liferay.Language.get('delete-folder'),
			onClick: () =>
				setShowModal((previousState: ViewObjectDefinitionsModals) => ({
					...previousState,
					deleteObjectFolder: true,
				})),
			symbolLeft: 'trash',
			value: 'deleteFolder',
		});
	}

	return kebabOptions;
}

export async function getUpdateModelBuilderStructurePayload(
	currentObjectFolderName: string
) {
	const objectFolderResponse = await API.getAllObjectFolders();

	const currentObjectFolder = objectFolderResponse.find(
		(objectFolder) => objectFolder.name === currentObjectFolderName
	) as ObjectFolder;

	const objectFoldersWithObjectDefinitions: ObjectFolder[] = await Promise.all(
		objectFolderResponse.map(async (objectFolder) => {
			const objectFolderWithObjectDefinitions: ObjectDefinitionNodeData[] = [];

			const objectDefinitionsFilteredByObjectFolder = await API.getObjectDefinitions(
				`filter=objectFolderExternalReferenceCode eq '${objectFolder.externalReferenceCode}'`
			);

			const linkedObjectDefinitions: ObjectDefinition[] = [];

			await Promise.all(
				objectFolder.objectFolderItems
					.filter(
						(objectFolderItem) =>
							objectFolderItem.linkedObjectDefinition
					)
					.map(async (objectFolderItem) => {
						const response = await API.getObjectDefinitionByExternalReferenceCode(
							objectFolderItem.objectDefinitionExternalReferenceCode
						);

						linkedObjectDefinitions.push(response);
					})
			);

			const updateObjectFoldersLinkedObjectDefinition = ({
				linked,
				objectDefinitions,
			}: {
				linked: boolean;
				objectDefinitions: ObjectDefinition[];
			}) => {
				objectDefinitions.forEach((objectDefinition) => {
					const objectFolderItem = objectFolder.objectFolderItems.find(
						(objectFolderItem) =>
							objectFolderItem.objectDefinitionExternalReferenceCode ===
							objectDefinition.externalReferenceCode
					);

					if (objectFolderItem) {
						objectFolderWithObjectDefinitions.push({
							...objectDefinition,
							hasObjectDefinitionDeleteResourcePermission: !!objectDefinition
								.actions.delete,
							hasObjectDefinitionManagePermissionsResourcePermission: !!objectDefinition
								.actions.permissions,
							hasObjectDefinitionUpdateResourcePermission: !!objectDefinition
								.actions.update,
							hasObjectDefinitionViewResourcePermission: !!objectDefinition
								.actions.get,
							hasSelfRelationships: false,
							linked,
							nodeSelected: false,
							objectFields: objectDefinition.objectFields.map(
								(field) =>
									({
										businessType: field.businessType,
										externalReferenceCode:
											field.externalReferenceCode,
										label: getLocalizableLabel(
											objectDefinition.defaultLanguageId,
											field.label,
											field.name
										),
										name: field.name,
										primaryKey: field.name === 'id',
										required: field.required,
										selected: false,
									} as ObjectFieldNode)
							),
						});
					}
				});
			};

			updateObjectFoldersLinkedObjectDefinition({
				linked: false,
				objectDefinitions: objectDefinitionsFilteredByObjectFolder,
			});

			updateObjectFoldersLinkedObjectDefinition({
				linked: true,
				objectDefinitions: linkedObjectDefinitions,
			});

			return {
				...objectFolder,
				objectDefinitions: objectFolderWithObjectDefinitions,
			};
		})
	);

	return {
		objectFolders: objectFoldersWithObjectDefinitions,
		selectedObjectFolder: currentObjectFolder,
	};
}

export function normalizeName(str: string) {
	const split = str.split(' ');
	const capitalizeFirstLetters = split.map((str: string) =>
		firstLetterUppercase(str)
	);
	const join = capitalizeFirstLetters.join('');

	return removeAllSpecialCharacters(join);
}
