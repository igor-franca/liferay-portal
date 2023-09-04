/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import classNames from 'classnames';
import React, {useEffect, useRef, useState} from 'react';
import {
	Handle,
	Node,
	NodeProps,
	Position,
	isNode,
	useStore,
} from 'react-flow-renderer';

import './DefinitionNode.scss';

import {
	API,
	ModalEditExternalReferenceCode,
	getLocalizableLabel,
	openToast,
} from '@liferay/object-js-components-web';
import {createResourceURL} from 'frontend-js-web';

import {formatActionURL} from '../../../utils/fds';
import {ModalAddObjectField} from '../../ObjectField/ModalAddObjectField';
import {ModalAddObjectRelationship} from '../../ObjectRelationship/ModalAddObjectRelationship';
import {ModalDeleteObjectDefinition} from '../../ViewObjectDefinitions/ModalDeleteObjectDefinition';
import {DeletedObjectDefinition} from '../../ViewObjectDefinitions/ViewObjectDefinitions';
import {getDefinitionNodeActions} from '../../ViewObjectDefinitions/objectDefinitionUtil';
import {useObjectFolderContext} from '../ModelBuilderContext/objectFolderContext';
import {TYPES} from '../ModelBuilderContext/typesEnum';
import NodeFields from './NodeFields';
import NodeFooter from './NodeFooter';
import NodeHeader from './NodeHeader';
import {RedirectModal} from './RedirectModal';

const selfRelationshipHandleStyle = {
	background: 'transparent',
	border: '2px transparent',
	borderRadius: '50%',
};

export function DefinitionNode({
	data: {
		defaultLanguageId,
		externalReferenceCode,
		hasObjectDefinitionDeleteResourcePermission,
		hasObjectDefinitionManagePermissionsResourcePermission,
		hasSelfRelationships,
		id,
		label,
		linked,
		name,
		nodeSelected,
		objectFields,
		status,
		system,
	},
}: NodeProps<ObjectDefinitionNodeData>) {
	const [showAllFields, setShowAllFields] = useState<boolean>(false);
	const [
		{
			baseResourceURL,
			editObjectDefinitionURL,
			elements,
			objectDefinitionPermissionsURL,
			selectedObjectDefinitionNode,
		},
		dispatch,
	] = useObjectFolderContext();
	const store = useStore();

	const handlePosition: {
		[key: string]: Position;
	} = {
		bottom: Position.Bottom,
		left: Position.Left,
		right: Position.Right,
		top: Position.Top,
	};

	const handleRefs: {
		[key: string]: React.RefObject<HTMLDivElement>;
	} = {
		bottom: useRef<HTMLDivElement>(null),
		left: useRef<HTMLDivElement>(null),
		right: useRef<HTMLDivElement>(null),
		top: useRef<HTMLDivElement>(null),
	};

	const displayHandles = (display: boolean) => {
		for (const key in handleRefs) {
			const handleRef = handleRefs[key].current;
			if (handleRef) {
				handleRef.style.opacity = display ? '1' : '0';
			}
		}
	};

	const [showModal, setShowModal] = useState<Partial<ModelBuilderModals>>({
		addObjectRelationship: false,
		deleteObjectDefinition: false,
		editObjectDefinitionERC: false,
	});
	const [parameterRequired, setParameterRequired] = useState(false);
	const [
		deletedObjectDefinition,
		setDeletedObjectDefinition,
	] = useState<DeletedObjectDefinition | null>();

	const [newExternalReferenceCode, setNewExternalReferenceCode] = useState(
		externalReferenceCode
	);

	const handleShowDeleteModal = () => {
		setShowModal({
			deleteObjectDefinition: true,
		});
	};

	const handleShowEditERCModal = () => {
		setShowModal({
			editObjectDefinitionERC: true,
		});
	};

	const handleShowRedirectModal = () => {
		setShowModal({
			redirectEditObjectDefinition: true,
		});
	};

	const viewDetailsURL = formatActionURL(editObjectDefinitionURL, id);

	useEffect(() => {
		const makeFetch = async () => {
			if (selectedObjectDefinitionNode) {
				const url = createResourceURL(baseResourceURL, {
					objectDefinitionId: selectedObjectDefinitionNode.id,
					p_p_resource_id:
						'/object_definitions/get_object_relationship_info',
				}).href;

				const {parameterRequired} = await API.fetchJSON<{
					parameterRequired: boolean;
				}>(url);

				setParameterRequired(parameterRequired);
			}
		};

		makeFetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedObjectDefinitionNode]);

	return (
		<>
			<div
				className={classNames(
					'lfr-objects__model-builder-node-container',
					{
						'lfr-objects__model-builder-node-container--link': linked,
						'lfr-objects__model-builder-node-container--selected': nodeSelected,
					}
				)}
				onClick={() => {
					const {edges, nodes} = store.getState();

					dispatch({
						payload: {
							edges,
							nodes,
							selectedObjectDefinitionId: id.toString(),
						},
						type: TYPES.SET_SELECTED_NODE,
					});
				}}
				onMouseEnter={() => {
					displayHandles(true);
				}}
				onMouseLeave={() => {
					displayHandles(false);
				}}
			>
				<NodeHeader
					dropDownItems={getDefinitionNodeActions({
						baseResourceURL,
						handleShowDeleteModal,
						handleShowEditERCModal,
						handleShowRedirectModal,
						hasObjectDefinitionDeleteResourcePermission,
						hasObjectDefinitionManagePermissionsResourcePermission,
						objectDefinitionId: id,
						objectDefinitionName: name,
						objectDefinitionPermissionsURL,
						setDeletedObjectDefinition,
						status,
					})}
					isLinkedObjectDefinition={linked}
					objectDefinitionLabel={getLocalizableLabel(
						defaultLanguageId,
						label,
						name
					)}
					status={status!}
					system={system}
				/>

				<NodeFields
					defaultLanguageId={defaultLanguageId}
					objectFields={objectFields}
					showAll={showAllFields}
				/>

				<NodeFooter
					isLinkedObjectDefinition={linked}
					setShowAllFields={setShowAllFields}
					setShowModal={setShowModal}
					showAllFields={showAllFields}
				/>

				<>
					{Object.keys(handleRefs).map((position, index) => (
						<Handle
							className="lfr-objects__model-builder-node-handle"
							id={id.toString()}
							key={index}
							position={handlePosition[position]}
							ref={handleRefs[position]}
							style={{
								background: '#80ACFF',
								height: '12px',
								[position]: '-18px',
								width: '12px',
							}}
							type="source"
						/>
					))}
				</>

				{hasSelfRelationships && (
					<>
						<Handle
							className="lfr-objects__model-builder-node-handle"
							id="fixedLeftHandle"
							position={Position.Left}
							style={{
								...selfRelationshipHandleStyle,
								left: '10px',
								top: '50%',
							}}
							type="source"
						/>

						<Handle
							className="lfr-objects__model-builder-node-handle"
							id="fixedRightHandle"
							position={Position.Right}
							style={{
								...selfRelationshipHandleStyle,
								right: '4px',
								top: '50%',
							}}
							type="target"
						/>
					</>
				)}
			</div>

			{showModal.addObjectField && (
				<ModalAddObjectField
					creationLanguageId={defaultLanguageId}
					objectDefinitionExternalReferenceCode={
						externalReferenceCode
					}
					objectFieldTypes={[]}
					objectName={name}
					onAfterSubmit={(newObjectField) => {
						const {edges, nodes} = store.getState();

						dispatch({
							payload: {
								edges,
								newObjectField,
								nodes,
								objectDefinitionExternalReferenceCode: externalReferenceCode,
							},
							type: TYPES.ADD_NEW_OBJECT_FIELD,
						});

						openToast({
							message: Liferay.Language.get(
								'field-successfully-added'
							),
							type: 'success',
						});

						setShowModal((prevState) => ({
							...prevState,
							addObjectField: false,
						}));

						setShowAllFields(true);
					}}
					setVisibility={() =>
						setShowModal((prevState) => ({
							...prevState,
							addObjectField: false,
						}))
					}
				/>
			)}

			{showModal.addObjectRelationship && (
				<ModalAddObjectRelationship
					baseResourceURL={baseResourceURL}
					handleOnClose={() => {
						setShowModal(
							(previousState: Partial<ModelBuilderModals>) => ({
								...previousState,
								addObjectRelationship: false,
							})
						);
					}}
					objectDefinitionExternalReferenceCode={
						selectedObjectDefinitionNode?.data
							?.externalReferenceCode as string
					}
					parameterRequired={parameterRequired}
				/>
			)}

			{showModal.deleteObjectDefinition && (
				<ModalDeleteObjectDefinition
					handleOnClose={() => {
						setShowModal(
							(previousState: Partial<ModelBuilderModals>) => ({
								...previousState,
								deleteObjectDefinition: false,
							})
						);
					}}
					objectDefinition={
						deletedObjectDefinition as DeletedObjectDefinition
					}
					setDeletedObjectDefinition={setDeletedObjectDefinition}
				/>
			)}

			{showModal.editObjectDefinitionERC && (
				<ModalEditExternalReferenceCode
					externalReferenceCode={newExternalReferenceCode as string}
					handleOnClose={() => {
						setShowModal(
							(previousState: Partial<ModelBuilderModals>) => ({
								...previousState,
								editObjectDefinitionERC: false,
							})
						);
					}}
					helpMessage={Liferay.Language.get(
						'unique-key-for-referencing-the-object-definition'
					)}
					onExternalReferenceCodeChange={(
						externalReferenceCode: string
					) => {
						const updatedElements = elements.map((element) => {
							if (
								isNode(element) &&
								(element as Node<ObjectDefinitionNodeData>)
									.id === id?.toString()
							) {
								return {
									...element,
									data: {
										...element.data,
										externalReferenceCode,
									},
								};
							}

							return element;
						});

						dispatch({
							payload: {
								newElements: updatedElements,
							},
							type: TYPES.SET_ELEMENTS,
						});
					}}
					onGetEntity={() => API.getObjectDefinitionById(id)}
					saveURL={`/o/object-admin/v1.0/object-definitions/${id}`}
					setExternalReferenceCode={setNewExternalReferenceCode}
				/>
			)}

			{showModal.redirectEditObjectDefinition && (
				<RedirectModal
					handleOnClose={() => {
						setShowModal({
							redirectEditObjectDefinition: false,
						});
					}}
					viewDetailsURL={viewDetailsURL}
				/>
			)}
		</>
	);
}
