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

import {
	getLocalizableLabel,
} from '@liferay/object-js-components-web';
import {sub} from 'frontend-js-web';
import React from 'react';

import {useFolderContext} from '../objectFolderContext';

import './RightSidebarDefinitionNode.scss';
import {AccountRestrictionContainer} from '../../ObjectDetails/AccountRestrictionContainer';
import {ConfigurationContainer} from '../../ObjectDetails/ConfigurationContainer';
import {KeyValuePair} from '../../ObjectDetails/EditObjectDetails';
import {EntryDisplayContainer} from '../../ObjectDetails/EntryDisplayContainer';
import {ObjectDataContainer} from '../../ObjectDetails/ObjectDataContainer';
import {ScopeContainer} from '../../ObjectDetails/ScopeContainer';

interface RightSidebarDefinitionNode {
	companyKeyValuePair: KeyValuePair[];
	siteKeyValuePair: KeyValuePair[];
}
export function RightSidebarDefinitionNode({
	companyKeyValuePair,
	siteKeyValuePair,
}: RightSidebarDefinitionNode) {
	const [{selectedDefinitionNode}] = useFolderContext();

	return (
		<>
			<div className="lfr-objects__model-builder-right-sidebar-definition-node-title">
				<span>
					{sub(
						Liferay.Language.get('x-details'),
						getLocalizableLabel(
							selectedDefinitionNode.defaultLanguageId,
							selectedDefinitionNode.label,
							selectedDefinitionNode.name
						)
					)}
				</span>
			</div>
			<div className="lfr-objects__model-builder-right-sidebar-definition-node-content">
				<ObjectDataContainer
					dbTableName={selectedDefinitionNode.dbTableName as string}
					errors={{}}
					handleChange={() => {}}
					hasUpdateObjectDefinitionPermission={true}
					isApproved={
						selectedDefinitionNode.status.label === 'approved'
					}
					setValues={() => {}}
					values={selectedDefinitionNode}
				/>
			</div>

			<div className="lfr-objects__model-builder-right-sidebar-definition-node-content">
				<EntryDisplayContainer
					errors={{}}
					nonRelationshipObjectFieldsInfo={[]}
					objectFields={selectedDefinitionNode.objectFields}
					setValues={() => {}}
					values={selectedDefinitionNode}
				/>

				<ScopeContainer
					companyKeyValuePair={companyKeyValuePair}
					errors={{}}
					hasUpdateObjectDefinitionPermission={true}
					isApproved={
						selectedDefinitionNode.status.label === 'approved'
					}
					setValues={() => {}}
					siteKeyValuePair={siteKeyValuePair}
					values={selectedDefinitionNode}
				/>
			</div>

			{(Liferay.FeatureFlags['LPS-167253']
				? selectedDefinitionNode.modifiable
				: !selectedDefinitionNode.system) && (
				<div className="lfr-objects__model-builder-right-sidebar-definition-node-content">
					<AccountRestrictionContainer
						errors={{}}
						isApproved={
							selectedDefinitionNode.status.label === 'approved'
						}
						objectFields={selectedDefinitionNode.objectFields}
						setValues={() => {}}
						values={selectedDefinitionNode}
					/>
				</div>
			)}

			<div className="lfr-objects__model-builder-right-sidebar-definition-node-content">
				<ConfigurationContainer
					hasUpdateObjectDefinitionPermission={true}
					setValues={() => {}}
					values={selectedDefinitionNode}
				/>
			</div>
		</>
	);
}
