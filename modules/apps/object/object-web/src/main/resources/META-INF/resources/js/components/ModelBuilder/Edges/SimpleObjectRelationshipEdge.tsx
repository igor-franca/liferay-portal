/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, { useEffect, useRef, useState } from 'react';

import {useObjectFolderContext} from '../ModelBuilderContext/objectFolderContext';
import {TYPES} from '../ModelBuilderContext/typesEnum';
import ManyMarker from './ManyMarker';
import {BaseObjectRepationShipEdgeProps} from './ObjectRelationshipEdge';
import OneMarker from './OneMarker';

import './Edge.scss';
import ClayIcon from '@clayui/icon';
import ClayButton from '@clayui/button';

interface SimpleObjectRelationshipEdgeProps
	extends BaseObjectRepationShipEdgeProps {
	id: number;
	label: string;
	markerEndId: string;
	markerStartId: string;
	objectRelationshipInheritance: boolean;
	reverseEdgePath?: string;
}

export function SimpleObjectRelationshipEdge({
	edgeCenterX,
	edgeCenterY,
	edgeId,
	edgePath,
	id,
	label,
	labelBgStyle,
	labelStyle,
	markerEndId,
	markerStartId,
	objectRelationshipEdgeStyle,
	objectRelationshipInheritance,
	reverseEdgePath,
}: SimpleObjectRelationshipEdgeProps) {
	const [_, dispatch] = useObjectFolderContext();
	const [foreignObjectWidth, setForeignObjectWidth] = useState<number>(0);
	
	const buttonRef = useRef(null);
	const foreignObjectHeight = 25;

	useEffect(() => {
		if(buttonRef.current) {
			const buttonWidth = (buttonRef.current as HTMLButtonElement).offsetWidth;
			setForeignObjectWidth(buttonWidth);
		}
	}, [buttonRef, label]);

	return (
		<>
			<OneMarker objectRelationshipId={id.toString()} />

			<ManyMarker objectRelationshipId={id.toString()} />
			<path
				className="react-flow__edge-path"
				d={edgePath}
				id={edgeId}
				markerEnd={`url(#${markerEndId})`}
				style={objectRelationshipEdgeStyle}
			/>

			<path
				className="react-flow__edge-path"
				d={reverseEdgePath}
				id={edgeId + 'reverse'}
				markerEnd={`url(#${markerStartId})`}
				style={objectRelationshipEdgeStyle}
			/>
			<foreignObject
				width={foreignObjectWidth}
				height={foreignObjectHeight}
				x={edgeCenterX - (foreignObjectWidth) / 2}
				y={edgeCenterY - foreignObjectHeight / 2}
			>
				<ClayButton
					ref={buttonRef}
					className="edgebutton"
					onClick={() => {
						dispatch({
							payload: {
								selectedObjectRelationshipId: id,
							},
							type: TYPES.SET_SELECTED_OBJECT_RELATIONSHIP_EDGE,
						});
					}}
					style={{backgroundColor: labelBgStyle.fill, height: labelBgStyle.height, paddingBottom: 1, paddingTop: 1, ...labelStyle, whiteSpace: "nowrap"}}
				>
					{label}
					{objectRelationshipInheritance &&
						<>
							&nbsp;
							<ClayIcon symbol="organizations" />
						</>
					}
			</ClayButton>
			</foreignObject>
		</>
	);
}
