/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import classNames from 'classnames';
import React, {useState} from 'react';
import {Handle, NodeProps, Position, useStore} from 'react-flow-renderer';

import './DefinitionNode.scss';
import {useFolderContext} from '../ModelBuilderContext/objectFolderContext';
import {TYPES} from '../ModelBuilderContext/typesEnum';
import {ObjectDefinitionNodeData, ObjectFieldNode} from '../types';
import NodeFields from './NodeFields';
import NodeFooter from './NodeFooter';
import NodeHeader from './NodeHeader';
import {getDefinitionActions} from '../../ViewObjectDefinitions/objectDefinitionUtil';
import { DeletedObjectDefinition } from '../../ViewObjectDefinitions/ViewObjectDefinitions';
import { ModalDeleteObjectDefinition } from '../../ViewObjectDefinitions/ModalDeleteObjectDefinition';

export function DefinitionNode({
	data: {
		defaultLanguageId,
		editObjectDefinitionURL,
		hasObjectDefinitionDeleteResourcePermission,
		hasObjectDefinitionManagePermissionsResourcePermission,
		isLinkedNode,
		label,
		name,
		nodeSelected,
		objectDefinitionId,
		objectDefinitionPermissionsURL,
		objectFields,
		status,
		system,
	},
}: NodeProps<ObjectDefinitionNodeData>) {
	const [showAllFields, setShowAllFields] = useState<boolean>(false);
	const [_, dispatch] = useFolderContext();
	const store = useStore();

	const handleNodeClick = () => {
		const {edges, nodes} = store.getState();

			dispatch({
				payload: {
					edges,
					nodes,
					selectedObjectDefinitionName: name as string,
				},
				type: TYPES.SET_SELECTED_NODE,
			});
	}
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>();
	const [
		deletedObjectDefinition,
		setDeletedObjectDefinition,
	] = useState<DeletedObjectDefinition | null>();

	return (
		
		<>
			<div
				className={classNames('lfr-objects__model-builder-node-container', {
					'lfr-objects__model-builder-node-container--selected': nodeSelected,
				})}
				onClick={handleNodeClick}
			>
				<NodeHeader
					kebabItems={getDefinitionActions(
						objectDefinitionId,
						name as string,
						hasObjectDefinitionDeleteResourcePermission,
						hasObjectDefinitionManagePermissionsResourcePermission,
						editObjectDefinitionURL,
						objectDefinitionPermissionsURL,
						status as any,
						setDeletedObjectDefinition,
						setShowDeleteModal,
					)}
					isLinkedNode={isLinkedNode as boolean}
					objectDefinitionLabel={label as string}
					status={status!}
					system={system as boolean} 
				/>

				<NodeFields
					defaultLanguageId={defaultLanguageId as Liferay.Language.Locale}
					objectFields={objectFields as ObjectFieldNode[]}
					showAll={showAllFields}
				/>

				<NodeFooter
					setShowAllFields={setShowAllFields}
					showAllFields={showAllFields}
				/>

				<Handle
					className="lfr-objects__model-builder-node-handle"
					hidden
					id={name}
					position={Position.Left}
					style={{
						background: '#80ACFF',
						height: '12px',
						left: '-30px',
						width: '12px',
					}}
					type="source"
				/>
			</div>
		
			{showDeleteModal && (
				<ModalDeleteObjectDefinition
					handleOnClose={() => {
						setShowDeleteModal(false);
					}}
					objectDefinition={deletedObjectDefinition as DeletedObjectDefinition}
					setDeletedObjectDefinition={setDeletedObjectDefinition}
				/>
			)}
		</>
	);
}
