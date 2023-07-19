/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ReactFlow, {Background, Controls, MiniMap} from 'react-flow-renderer';

import {ObjectDefinitionNode} from '../DefinitionNode/ObjectDefinitionNode';

import './DiagramBuilder.scss';

import React from 'react';

function DiagramBuilder() {
	const NODE_TYPES = {
		square: ObjectDefinitionNode,
	};

	const INITIAL_NODES = [
		{
			id: 'A',
			type: 'square',
			position: {
				x: 450,
				y: 370,
			},
			data: {
				objectDefinitionLabel: 'Postal Address',
				objectDefinitionName: 'portalAddress',
				system: false,
				hasDeleteResourcePermission: true,
				hasObjectDefinitionPublished: false,
				hasManagePermissionsResourcePermission: true,
				isLinkedNode: true,
				objectFields: [
					{
						label: 'ID',
						name: 'id',
						primaryKey: true,
						businessType: 'LongInteger',
						selected: false,
					},
					{
						label: 'External Reference Code',
						name: 'erc',
						primaryKey: false,
						businessType: 'Text',
						selected: true,
					},
					{
						label: 'Name',
						name: 'name',
						primaryKey: false,
						businessType: 'Text',
						selected: false,
					},
					{
						label: 'Street 1',
						name: 'street1',
						primaryKey: false,
						businessType: 'Text',
						selected: false,
					},
					{
						label: 'Author',
						name: 'author',
						primaryKey: false,
						businessType: 'Text',
						selected: false,
					},
					{
						label: 'Create Date',
						name: 'createDate',
						primaryKey: false,
						businessType: 'Date',
						selected: false,
					},
					{
						label: 'Modified Date',
						name: 'modifiedDate',
						primaryKey: false,
						businessType: 'Date',
						selected: false,
					},
					{
						label: 'Status',
						name: 'status',
						primaryKey: false,
						businessType: 'Text',
						selected: false,
					},
				],
				nodeSelected: true,
			},
		},
		{
			id: 'B',
			type: 'square',
			position: {
				x: 100,
				y: 100,
			},
			data: {
				objectDefinitionLabel: 'User',
				objectDefinitionName: 'user',
				system: false,
				hasDeleteResourcePermission: true,
				hasObjectDefinitionPublished: false,
				hasManagePermissionsResourcePermission: true,
				isLinkedNode: false,
				objectFields: [
					{
						label: 'ID',
						name: 'id',
						primaryKey: true,
						businessType: 'LongInteger',
						selected: false,
					},
					{
						label: 'External Reference Code',
						name: 'erc',
						primaryKey: false,
						businessType: 'Text',
						selected: true,
					},
					{
						label: 'Name',
						name: 'name',
						primaryKey: false,
						businessType: 'Text',
						selected: false,
					},
					{
						label: 'Street 1',
						name: 'street1',
						primaryKey: false,
						businessType: 'Text',
						selected: false,
					},
					{
						label: 'Author',
						name: 'author',
						primaryKey: false,
						businessType: 'Text',
						selected: false,
					},
					{
						label: 'Create Date',
						name: 'createDate',
						primaryKey: false,
						businessType: 'Date',
						selected: false,
					},
					{
						label: 'Modified Date',
						name: 'modifiedDate',
						primaryKey: false,
						businessType: 'Date',
						selected: false,
					},
					{
						label: 'Status',
						name: 'status',
						primaryKey: false,
						businessType: 'Text',
						selected: false,
					},
				],
				nodeSelected: true,
			},
		},
	];

	return (
		<div className="lfr-objects__object-diagram">
			<ReactFlow
				elements={INITIAL_NODES}
				minZoom={0.1}
				nodeTypes={NODE_TYPES}
			>
				<Background size={1} />

				<div className="lfr-objects__object-diagram-controls">
					<Controls showInteractive={false} />

					<MiniMap />
				</div>
			</ReactFlow>
		</div>
	);
}

export default DiagramBuilder;
