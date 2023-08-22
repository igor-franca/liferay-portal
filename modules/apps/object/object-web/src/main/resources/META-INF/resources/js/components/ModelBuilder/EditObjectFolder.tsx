/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {API} from '@liferay/object-js-components-web';
import React, {useEffect, useState} from 'react';

import {KeyValuePair} from '../ObjectDetails/EditObjectDetails';
import {TDeletionType} from '../ObjectRelationship/EditRelationship';
import {ModalAddObjectDefinition} from '../ViewObjectDefinitions/ModalAddObjectDefinition';
import {ModalEditFolder} from '../ViewObjectDefinitions/ModalEditFolder';
import {ViewObjectDefinitionsModals} from '../ViewObjectDefinitions/ViewObjectDefinitions';
import Diagram from './Diagram/Diagram';
import Header from './Header/Header';
import LeftSidebar from './LeftSidebar/LeftSidebar';
import {useFolderContext} from './ModelBuilderContext/objectFolderContext';
import {TYPES} from './ModelBuilderContext/typesEnum';
import {RightSideBar} from './RightSidebar/index';

interface EditObjectFolder {
	companyKeyValuePair: KeyValuePair[];
	deletionTypes: TDeletionType[];
	folderName: string;
	siteKeyValuePair: KeyValuePair[];
}
export default function EditObjectFolder({
	companyKeyValuePair,
	deletionTypes,
	folderName,
	siteKeyValuePair,
}: EditObjectFolder) {
	const [
		{rightSidebarType, selectedFolder, storages, viewApiUrl},
		dispatch,
	] = useFolderContext();

	const [showModal, setShowModal] = useState<ViewObjectDefinitionsModals>({
		addFolder: false,
		addObjectDefinition: false,
		deleteFolder: false,
		deleteObjectDefinition: false,
		editERC: false,
		editFolder: false,
		moveObjectDefinition: false,
		redirectEditObjectDefinition: false,
	});

	useEffect(() => {
		const makeFetch = async () => {
			const folderResponse = await API.getAllFolders();

			const currentFolder = folderResponse.find(
				(folder) => folder.name === folderName
			) as ObjectFolder;

			const objectFoldersWithDefinitions: ObjectFolder[] = await Promise.all(
				folderResponse.map(async (folder) => {
					const folderDefinitions = await API.getObjectDefinitions(
						`filter=objectFolderExternalReferenceCode eq '${folder.externalReferenceCode}'`
					);

					return {
						...folder,
						definitions: folderDefinitions,
					};
				})
			);

			dispatch({
				payload: {
					objectFolders: objectFoldersWithDefinitions,
					selectedFolder: currentFolder,
				},
				type: TYPES.CREATE_MODEL_BUILDER_STRUCTURE,
			});
		};

		makeFetch();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{showModal.addObjectDefinition && (
				<ModalAddObjectDefinition
					apiURL={viewApiUrl}
					handleOnClose={() =>
						setShowModal(
							(previousState: ViewObjectDefinitionsModals) => ({
								...previousState,
								addObjectDefinition: false,
							})
						)
					}
					objectFolderExternalReferenceCode={
						selectedFolder.externalReferenceCode
					}
					onAfterSubmit={(newObjectDefinition) => {
						dispatch({
							payload: {
								newObjectDefinition,
								selectedFolderName: selectedFolder.name,
							},
							type: TYPES.ADD_NEW_NODE_TO_FOLDER,
						});
					}}
					reload={false}
					storages={storages}
				/>
			)}

			{showModal.editFolder && (
				<ModalEditFolder
					externalReferenceCode={selectedFolder.externalReferenceCode}
					folderID={selectedFolder.id}
					handleOnClose={() => {
						setShowModal(
							(previousState: ViewObjectDefinitionsModals) => ({
								...previousState,
								editFolder: false,
							})
						);
					}}
					initialLabel={selectedFolder.label}
					name={selectedFolder.name}
				/>
			)}

			<Header
				folderExternalReferenceCode={
					selectedFolder.externalReferenceCode
				}
				folderName={selectedFolder.name}
				hasDraftObjectDefinitions={false}
				setShowModal={setShowModal}
			/>
			<div className="lfr-objects__model-builder-diagram-container">
				<LeftSidebar
					selectedFolderName={selectedFolder.name}
					setShowModal={setShowModal}
				/>

				<Diagram setShowModal={setShowModal} />

				<RightSideBar.Root>
					{rightSidebarType === 'empty' && <RightSideBar.Empty />}

					{rightSidebarType === 'objectDefinitionDetails' && (
						<RightSideBar.ObjectDefinitionDetails
							companyKeyValuePair={companyKeyValuePair}
							siteKeyValuePair={siteKeyValuePair}
						/>
					)}

					{rightSidebarType === 'objectRelationshipDetails' && (
						<RightSideBar.Relationship
							deletionTypes={deletionTypes}
						/>
					)}
				</RightSideBar.Root>
			</div>
		</>
	);
}
