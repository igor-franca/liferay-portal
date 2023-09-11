/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/// <reference types="react" />

import {Edge, Elements, Node} from 'react-flow-renderer';
import {TYPES} from './ModelBuilderContext/typesEnum';
declare type TDropDownType =
	| 'checkbox'
	| 'contextual'
	| 'group'
	| 'item'
	| 'radio'
	| 'radiogroup'
	| 'divider';
export declare type DropDownItems = {
	active?: boolean;
	checked?: boolean;
	disabled?: boolean;
	href?: string;
	items?: Array<IItem>;
	label?: string;
	name?: string;
	onChange?: Function;
	onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	symbolLeft?: string;
	symbolRight?: string;
	type?: TDropDownType;
	value?: string;
};
export declare type TAction =
	| {
			payload: {
				newObjectDefinition: ObjectDefinition;
				selectedObjectFolderName: string;
			};
			type: TYPES.ADD_NEW_NODE_TO_OBJECT_FOLDER;
	  }
	| {
			payload: {
				edges: Edge<ObjectRelationshipEdgeData>[];
				newObjectField: ObjectField;
				nodes: Node<ObjectDefinitionNodeData>[];
				objectDefinitionExternalReferenceCode: string;
			};
			type: TYPES.ADD_NEW_OBJECT_FIELD;
	  }
	| {
			payload: {
				hiddenObjectFolderNodes: boolean;
				leftSidebarItem: LeftSidebarItemType;
			};
			type: TYPES.BULK_CHANGE_NODE_VIEW;
	  }
	| {
			payload: {
				hiddenNode: boolean;
				leftSidebarItem: LeftSidebarItemType;
				objectDefinitionId: number;
				objectDefinitionName: string;
			};
			type: TYPES.CHANGE_NODE_VIEW;
	  }
	| {
			payload: {
				objectFolders: ObjectFolder[];
				selectedObjectFolder: ObjectFolder;
			};
			type: TYPES.CREATE_MODEL_BUILDER_STRUCTURE;
	  }
	| {
			payload: {
				currentObjectFolderName: string;
				deletedNodeName: string;
			};
			type: TYPES.DELETE_OBJECT_FOLDER_NODE;
	  }
	| {
			payload: {
				edges: Edge<ObjectRelationshipEdgeData>[];
				nodes: Node<ObjectDefinitionNodeData>[];
				selectedField: ObjectFieldNode;
				selectedNode: Node<ObjectDefinitionNodeData>;
			};
			type: TYPES.DELETE_OBJECT_FIELD;
	  }
	| {
			payload: {
				newElements: any;
			};
			type: TYPES.SET_ELEMENTS;
	  }
	| {
			payload: {
				edges: Edge<ObjectRelationshipEdgeData>[];
				nodes: Node<ObjectDefinitionNodeData>[];
				selectedObjectRelationshipId: string;
			};
			type: TYPES.SET_SELECTED_EDGE;
	  }
	| {
			payload: {
				edges: Edge<ObjectRelationshipEdgeData>[];
				nodes: Node<ObjectDefinitionNodeData>[];
				selectedFieldDefinitionName: string;
				selectedObjectDefinitionId: number;
			};
			type: TYPES.SET_SELECTED_FIELD;
	  }
	| {
			payload: {
				edges: Edge<ObjectRelationshipEdgeData>[];
				nodes: Node<ObjectDefinitionNodeData>[];
				selectedObjectDefinitionId: string;
			};
			type: TYPES.SET_SELECTED_NODE;
	  }
	| {
			payload: {
				updatedShowChangesSaved: boolean;
			};
			type: TYPES.SET_SHOW_CHANGES_SAVED;
	  }
	| {
			payload: {
				edges: Edge<ObjectRelationshipEdgeData>[];
				nodes: Node<ObjectDefinitionNodeData>[];
				selectedNode: Node<ObjectDefinitionNodeData>;
				updatedField: ObjectField;
			};
			type: TYPES.UPDATE_OBJECT_FIELD;
	  }
	| {
			payload: {
				currentObjectFolderName: string;
				updatedNode: Partial<ObjectDefinition>;
			};
			type: TYPES.UPDATE_OBJECT_FOLDER_NODE;
	  };
export declare type TState = {
	baseResourceURL: string;
	editObjectDefinitionURL: string;
	elements: Elements<ObjectDefinitionNodeData | ObjectRelationshipEdgeData>;
	filterOperators: TFilterOperators;
	forbiddenChars: string[];
	forbiddenLastChars: string[];
	forbiddenNames: string[];
	leftSidebarItems: LeftSidebarItemType[];
	objectDefinitionPermissionsURL: string;
	objectDefinitions: ObjectDefinition[];
	objectFolders: ObjectFolder[];
	objectWebLearnResources: ObjectWebLearnResources;
	rightSidebarType: RightSidebarType;
	selectedObjectDefinitionNode: Node<ObjectDefinitionNodeData> | null;
	selectedObjectFolder: ObjectFolder;
	selectedObjectRelationship: ObjectRelationship;
	showChangesSaved: boolean;
	storages: LabelValueObject[];
	viewApiURL: string;
	workflowStatusJSONArray: LabelValueObject[];
};
export declare type LeftSidebarItemType = {
	hiddenObjectFolderNodes: boolean;
	id?: string;
	name: string;
	objectDefinitions?: LeftSidebarObjectDefinitionItemType[];
	objectFolderName: string;
	type: 'objectFolder' | 'objectDefinition';
};
export declare type LeftSidebarObjectDefinitionItemType = {
	hiddenNode: boolean;
	id: number;
	label: string;
	linked?: boolean;
	name: string;
	selected: boolean;
	type: 'objectDefinition' | 'objectLink';
};
export declare type ObjectDefinitionNodeTypes = 'objectDefinition';
export interface ObjectRelationshipEdgeData {
	defaultLanguageId?: Liferay.Language.Locale;
	edgeSelected: boolean;
	label: string;
	markerEndId: string;
	markerStartId: string;
	objectRelationshipId: number;
	selfRelationships?: ObjectRelationship[];
	sourceY: number;
	targetY: number;
	type: string;
}
export declare type nonRelationshipObjectFieldsInfo = {
	label: LocalizedValue<string>;
	name: string;
};
export declare type RightSidebarType =
	| 'empty'
	| 'objectFieldDetails'
	| 'objectDefinitionDetails'
	| 'objectRelationshipDetails';
export {};
