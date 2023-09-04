/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ReactFlow, {
	Background,
	Connection,
	ConnectionMode,
	Controls,
	Edge,
	MiniMap,
	Node,
	isNode,
} from 'react-flow-renderer';

import {DefinitionNode} from '../DefinitionNode/DefinitionNode';
import {EmptyNode} from '../DefinitionNode/EmptyNode';

import './Diagram.scss';

import {API} from '@liferay/object-js-components-web';
import React, {MouseEvent, useCallback, useState} from 'react';

import {ModalAddObjectRelationship} from '../../ObjectRelationship/ModalAddObjectRelationship';
import DefaultEdge from '../Edges/DefaultEdge';
import SelfEdge from '../Edges/SelfEdge';
import {useObjectFolderContext} from '../ModelBuilderContext/objectFolderContext';
import {TYPES} from '../ModelBuilderContext/typesEnum';

const NODE_TYPES = {
	emptyNode: EmptyNode,
	objectDefinition: DefinitionNode,
};

const EDGE_TYPES = {
	default: DefaultEdge,
	self: SelfEdge,
};

function DiagramBuilder({
	setShowModal,
}: {
	setShowModal: (value: React.SetStateAction<ModelBuilderModals>) => void;
}) {
	const [
		{baseResourceURL, elements, selectedObjectFolder, showChangesSaved},
		dispatch,
	] = useObjectFolderContext();

	const [showAddModal, setShowAddModal] = useState(false);
	const [nodesProps, setNodesProps] = useState<{
		parameterRequired: boolean;
		sourceNode: {
			erc: string;
		};
		targetNode: {
			erc: string;
		};
	}>();

	const emptyNode = [
		{
			data: {
				setShowModal,
			},
			id: 'empty',
			position: {
				x: 400,
				y: 400,
			},
			type: 'emptyNode',
		},
	];

	const onConnect = useCallback(
		(connection: Connection | Edge) => {
			const sourceNode = elements.find(
				(node) => isNode(node) && node.id === connection.source
			) as Node<ObjectDefinitionNodeData>;

			const targetNode = elements.find(
				(node) => isNode(node) && node.id === connection.target
			) as Node<ObjectDefinitionNodeData>;

			setShowAddModal(true);
			setNodesProps({
				parameterRequired: sourceNode?.data?.parameterRequired!,
				sourceNode: {
					erc: sourceNode?.data?.externalReferenceCode!,
				},
				targetNode: {
					erc: targetNode?.data?.externalReferenceCode!,
				},
			});
		},
		[elements]
	);

	const onNodeDragStop = async (
		event: MouseEvent,
		node: Node<ObjectDefinitionNodeData>
	) => {
		const objectFolder = await API.getObjectFolderByERC(
			selectedObjectFolder.externalReferenceCode
		);

		const updatedObjectFolderItems = objectFolder.objectFolderItems.map(
			(objectFolderItem) => {
				if (
					objectFolderItem.objectDefinitionExternalReferenceCode ===
					node.data?.externalReferenceCode
				) {
					return {
						...objectFolderItem,
						positionX: node.position.x,
						positionY: node.position.y,
					};
				}

				return objectFolderItem;
			}
		);

		const updatedObjectFolder = {
			externalReferenceCode: selectedObjectFolder.externalReferenceCode,
			id: selectedObjectFolder.id,
			label: selectedObjectFolder.label,
			name: selectedObjectFolder.name,
			objectFolderItems: updatedObjectFolderItems,
		};

		API.putObjectFolderByERC(updatedObjectFolder);

		if (!showChangesSaved) {
			dispatch({
				payload: {updatedShowChangesSaved: true},
				type: TYPES.SET_SHOW_CHANGES_SAVED,
			});
		}
	};

	return (
		<div className="lfr-objects__model-builder-diagram-area">
			{showAddModal && (
				<ModalAddObjectRelationship
					baseResourceURL={baseResourceURL}
					handleOnClose={() => setShowAddModal(false)}
					objectDefinitionExternalReferenceCode1={
						nodesProps?.sourceNode.erc!
					}
					objectDefinitionExternalReferenceCode2={
						nodesProps?.targetNode.erc!
					}
					parameterRequired={nodesProps?.parameterRequired!}
				/>
			)}

			<ReactFlow
				connectionMode={ConnectionMode.Loose}
				edgeTypes={EDGE_TYPES}
				elements={elements.length ? elements : emptyNode}
				minZoom={0.1}
				nodeTypes={NODE_TYPES}
				onConnect={onConnect}
				onNodeDragStop={onNodeDragStop}
			>
				<Background size={1} />

				<Controls showInteractive={false} />

				<MiniMap />
			</ReactFlow>
		</div>
	);
}

export default DiagramBuilder;
