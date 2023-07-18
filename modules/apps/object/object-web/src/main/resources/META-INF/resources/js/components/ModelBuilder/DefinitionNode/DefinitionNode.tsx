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

import classNames from 'classnames';
import React, {useState} from 'react';
import {NodeProps} from 'react-flow-renderer';

import './DefinitionNode.scss';
import NodeFields from './NodeFields';
import NodeFooter from './NodeFooter';
import NodeHeader from './NodeHeader';

export function DefinitionNode(props: NodeProps) {
	const [showAllFields, setShowAllFields] = useState<boolean>(false);

	return (
		<div
			className={classNames('lfr-objects__model-builder-node-container', {
				'lfr-objects__model-builder-node-container-selected':
					props.data.nodeSelected,
			})}
		>
			<NodeHeader
				hasDeleteResourcePermission={
					props.data.hasDeleteResourcePermission
				}
				hasManagePermissionsResourcePermission={
					props.data.hasManagePermissionsResourcePermission
				}
				hasObjectDefinitionPublished={
					props.data.hasObjectDefinitionPublished
				}
				isLinkedNode={props.data.isLinkedNode}
				objectDefinitionLabel={props.data.objectDefinitionLabel}
				system={props.data.system}
			/>

			<NodeFields
				objectFields={props.data.objectFields}
				showAll={showAllFields}
			/>

			<NodeFooter
				setShowAllFields={setShowAllFields}
				showAllFields={showAllFields}
			/>
		</div>
	);
}
