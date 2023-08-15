/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayButtonWithIcon} from '@clayui/button';
import {ClayDropDownWithItems} from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';
import ClayLabel from '@clayui/label';
import React, {useState} from 'react';

import './NodeHeader.scss';
import { ModalDeleteObjectDefinition } from '../../ViewObjectDefinitions/ModalDeleteObjectDefinition';
import { DeletedObjectDefinition } from '../../ViewObjectDefinitions/ViewObjectDefinitions';

interface NodeHeaderProps {
	isLinkedNode: boolean;
	kebabItems: any[];
	objectDefinitionLabel: string;
	status: {
		code: number;
		label: string;
		label_i18n: string;
	};
	system: boolean;
}

export default function NodeHeader({
	isLinkedNode,
	kebabItems,
	objectDefinitionLabel,
	status,
	system,
}: NodeHeaderProps) {
	return (
		<>
			<div className="lfr-objects__model-builder-node-header-container">
				<div className="lfr-objects__model-builder-node-header-label-container">
					<div className="lfr-objects__model-builder-node-header-label-title">
						{isLinkedNode && (
							<ClayIcon className="c-pt-1 text-4" symbol="link" />
						)}

						<span>{objectDefinitionLabel}</span>
					</div>

					<ClayDropDownWithItems
						className="lfr__object-web-view-object-definitions-actions"
						items={kebabItems}
						trigger={
							<ClayButtonWithIcon
								aria-label={Liferay.Language.get('show-actions')}
								displayType="secondary"
								size="sm"
								symbol="ellipsis-v"
							/>
						}
					/>
				</div>

				<div>
					<ClayLabel displayType={system ? 'info' : 'warning'}>
						{Liferay.Language.get(system ? 'system' : 'custom')}
					</ClayLabel>

					<ClayLabel
						displayType={
							status?.label === 'approved' ? 'success' : 'info'
						}
					>
						{Liferay.Language.get(
							status?.label === 'approved' ? 'approved' : 'draft'
						)}
					</ClayLabel>
				</div>
			</div>
		</>
	);
}
