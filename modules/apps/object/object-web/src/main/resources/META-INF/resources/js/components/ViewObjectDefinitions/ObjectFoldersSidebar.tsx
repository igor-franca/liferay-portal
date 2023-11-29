/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton, {ClayButtonWithIcon} from '@clayui/button';
import {Text} from '@clayui/core';
import {ClayDropDownWithItems} from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';
import ClayList from '@clayui/list';
import {getLocalizableLabel} from '@liferay/object-js-components-web';
import {createResourceURL, fetch, sub} from 'frontend-js-web';
import React, {SetStateAction} from 'react';

import {defaultLanguageId} from '../../utils/constants';
import { ModalImportProperties } from './ViewObjectDefinitions';

interface ObjectFoldersSidebarProps {
	baseResourceURL: string;
	importObjectFolderURL: string;
	objectFolderRequestInfo: ObjectFolderRequestInfo;
	portletNamespace: string;
	selectedObjectFolder: ObjectFolder;
	setModalImportProperties: (
		value: SetStateAction<ModalImportProperties>
	) => void; 
	setSelectedObjectFolder: (
		value: SetStateAction<Partial<ObjectFolder>>
	) => void;
	setShowModal: (value: SetStateAction<ViewObjectDefinitionsModals>) => void;
}

export default function ObjectFoldersSideBar({
	baseResourceURL,
	importObjectFolderURL,
	objectFolderRequestInfo,
	portletNamespace,
	selectedObjectFolder,
	setModalImportProperties,
	setSelectedObjectFolder,
	setShowModal,
}: ObjectFoldersSidebarProps) {
	const objectFoldersKebabOptions = [];

	const importObjectFolderLocalized = sub(
		Liferay.Language.get('import-x'),
		Liferay.Language.get('object-folder')
	);

	if (selectedObjectFolder.actions.get) {
		objectFoldersKebabOptions.push({
			label: sub(
				Liferay.Language.get('export-x'),
				Liferay.Language.get('object-folder')
			),
			onClick: () => {
				const makeFetch = async () => {
					if (selectedObjectFolder) {
						const exportObjectFolderURL = createResourceURL(
							baseResourceURL,
							{
								objectFolderId: selectedObjectFolder.id,
								p_p_resource_id:
									'/object_definitions/export_object_folder',
							}
						).href;

						const response = await fetch(exportObjectFolderURL);
						const responseHeaders = response.headers.get(
							'Content-Disposition'
						);

						if (
							response.ok &&
							responseHeaders?.includes('attachment')
						) {
							const responseBlob = await response.blob();
							const downloadElement = document.createElement('a');

							downloadElement.download =
								responseHeaders.split('filename=')[1] + '.json';
							downloadElement.href = URL.createObjectURL(
								responseBlob
							);

							document.body.appendChild(downloadElement);

							downloadElement.click();
						}
					}
				};

				makeFetch();
			},
			symbolLeft: 'export',
		});
	}

	if (objectFolderRequestInfo.actions.updateBatch) {
		objectFoldersKebabOptions.push({
			label: importObjectFolderLocalized,
			onClick: () => {
				setModalImportProperties({
					apiURL:
						'/o/object-admin/v1.0/object-definitions/by-external-reference-code/',
					externalReferenceCodeFeedbackMessage: '',
					importURL: importObjectFolderURL,
					JSONInputId: `${portletNamespace}objectFolderJSON`,
					title: sub(
						Liferay.Language.get(
							'import-x'
						),
						Liferay.Language.get('object-folder')
					),
					warningModalText: {
						body: [
							Liferay.Language.get(
								'there-is-an-object-definition-with-the-same-external-reference-code-as-the-imported-one'
							),
							sub(
								Liferay.Language.get(
									'before-importing-the-new-x-you-may-want-to-back-up-its-entries-to-prevent-data-loss'
								),
								Liferay.Language.get('object-definition')
							),
							Liferay.Language.get(
								'do-you-want-to-proceed-with-the-import-process'
							),
						],
						header: Liferay.Language.get(
							'update-existing-object-definition'
						),
					},
				});

				setShowModal((previousState: ViewObjectDefinitionsModals) => ({
					...previousState,
					importModal: true,
				}))
			},
			symbolLeft: 'import',
		});
	}

	return (
		<div className="lfr__object-web-view-object-definitions-object-folder-list-container">
			<div className="lfr__object-web-view-object-definitions-object-folder-list-header">
				<span className="lfr__object-web-view-object-definitions-object-folder-list-title mb-0">
					{Liferay.Language.get('object-folders').toUpperCase()}
				</span>

				<div className="d-flex">
					<ClayButton
						aria-label={Liferay.Language.get('add-object-folder')}
						className="component-action"
						displayType="unstyled"
						monospaced
						onClick={() =>
							setShowModal(
								(
									previousState: ViewObjectDefinitionsModals
								) => ({
									...previousState,
									addObjectFolder: true,
								})
							)
						}
					>
						<ClayIcon symbol="plus" />
					</ClayButton>

					<ClayDropDownWithItems
						items={objectFoldersKebabOptions}
						trigger={
							<ClayButtonWithIcon
								aria-label={Liferay.Language.get(
									'object-folders-actions'
								)}
								className="component-action"
								displayType="unstyled"
								monospaced
								onClick={(event) => {
									event?.stopPropagation();
								}}
								symbol="ellipsis-v"
							/>
						}
					/>
				</div>
			</div>

			<ClayList className="lfr__object-web-view-object-definitions-object-folder-list">
				{objectFolderRequestInfo.items.map((currentObjectFolder) => (
					<ClayList.Item
						action
						active={
							selectedObjectFolder.externalReferenceCode ===
							currentObjectFolder.externalReferenceCode
						}
						className="cursor-pointer lfr__object-web-view-object-definitions-object-folder-list-item"
						flex
						key={currentObjectFolder.name}
						onClick={() => {
							setSelectedObjectFolder(currentObjectFolder);
						}}
					>
						<span className="lfr__object-web-view-object-definitions-object-folder-list-item-label">
							<Text truncate>
								{getLocalizableLabel(
									defaultLanguageId,
									currentObjectFolder.label,
									currentObjectFolder.name
								)}
							</Text>
						</span>
					</ClayList.Item>
				))}
			</ClayList>
		</div>
	);
}
