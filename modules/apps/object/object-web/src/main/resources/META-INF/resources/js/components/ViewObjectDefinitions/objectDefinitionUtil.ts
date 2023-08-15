/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {API} from '@liferay/object-js-components-web';
import {createResourceURL, openModal, sub} from 'frontend-js-web';
import {SetStateAction} from 'react';

import {formatActionURL} from '../../utils/fds';
import {
	firstLetterUppercase,
	removeAllSpecialCharacters,
} from '../../utils/string';
import {DeletedObjectDefinition, ViewObjectDefinitionsModals} from './ViewObjectDefinitions';
import { useFolderContext } from '../ModelBuilder/ModelBuilderContext/objectFolderContext';
import {TYPES} from '../../components/ModelBuilder/ModelBuilderContext/typesEnum';


type folderAction = {
	href: string;
	method: string;
};

type folderActions = {
	delete?: folderAction;
	get?: folderAction;
	permissions?: folderAction;
	update?: folderAction;
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

export async function deleteObjectDefinition(
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

export function getDefinitionActions(
	objectDefinitionId: number,
	objectDefinitionName: string,
	hasObjectDefinitionDeleteResourcePermission: boolean,
	hasObjectDefinitionManagePermissionsResourcePermission: boolean,
	editObjectDefinitionURL: string,
	objectDefinitionPermissionsURL: string,
	status: {
		code: number;
		label: string;
		label_i18n: string;
	},
	setDeletedObjectDefinition: (value: DeletedObjectDefinition) => void,
	setShowDeleteModal: (value: boolean) => void,
) {
	const [{baseResourceURL, selectedFolderERC}, dispatch] = useFolderContext();
	const viewDetailsUrl = formatActionURL(editObjectDefinitionURL, objectDefinitionId);
	const PermissionUrl = formatActionURL(objectDefinitionPermissionsURL, objectDefinitionId);

	const kebabOptions = [
		{
			label: sub(
				Liferay.Language.get('edit-in-x'),
				Liferay.Language.get('page view')
			),
			onClick: () => {
				window.open(viewDetailsUrl, '_blank');
			},
			symbolLeft: 'shortcut',
		},
		{type: 'divider'},
	];

	if (hasObjectDefinitionManagePermissionsResourcePermission) {
		kebabOptions.push({
			label: sub(
				Liferay.Language.get('manage-x'),
				Liferay.Language.get('permissions')
			),
			onClick: () => {
				openModal({
					title: Liferay.Language.get('permissions'),
					url: PermissionUrl,
				})
			},
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
			onClick: () => {
				const getDeleteObjectDefinition = async () => {
					const url = createResourceURL(baseResourceURL, {
						objectDefinitionId: objectDefinitionId,
						p_p_resource_id:
							'/object_definitions/get_object_definition_delete_info',
					}).href;

					const {
						hasObjectRelationship,
						objectEntriesCount,
					} = await API.fetchJSON<{
						hasObjectRelationship: boolean;
						objectEntriesCount: number;
					}>(url);

					const {name} = await API.getFolderByERC(
						selectedFolderERC
					);

					if (status.code !== 0) {
						await deleteObjectDefinition(
							objectDefinitionId,
							objectDefinitionName
						);
						dispatch({
							payload: {
								currentFolderName: name, 
								deletedNodeName: objectDefinitionName
							},
							type: TYPES.DELETE_FOLDER_DEFINITION,
						});

						return;
					}

					setDeletedObjectDefinition({
						...{name: objectDefinitionName, id: objectDefinitionId},
						hasObjectRelationship,
						objectEntriesCount,
					});

					setShowDeleteModal(true);
				};

				getDeleteObjectDefinition();
			},
			symbolLeft: 'trash',
		});
	}

	return kebabOptions;
}

export function getFolderActions(
	id: number,
	objectFolderPermissionsURL: string,
	setShowModal: (value: SetStateAction<ViewObjectDefinitionsModals>) => void,
	actions?: folderActions
) {
	const url = formatActionURL(objectFolderPermissionsURL, id);
	const kebabOptions = [
		{
			label: Liferay.Language.get('import-object'),
			onClick: () => {},
			symbolLeft: 'import',
			value: 'importObject',
		},
		{type: 'divider'},
	];

	if (actions?.update) {
		kebabOptions.unshift({type: 'divider'});
		kebabOptions.unshift({
			label: Liferay.Language.get('edit-label-and-erc'),
			onClick: () =>
				setShowModal((previousState: ViewObjectDefinitionsModals) => ({
					...previousState,
					editFolder: true,
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
					deleteFolder: true,
				})),
			symbolLeft: 'trash',
			value: 'deleteFolder',
		});
	}

	return kebabOptions;
}

export function normalizeName(str: string) {
	const split = str.split(' ');
	const capitalizeFirstLetters = split.map((str: string) =>
		firstLetterUppercase(str)
	);
	const join = capitalizeFirstLetters.join('');

	return removeAllSpecialCharacters(join);
}
