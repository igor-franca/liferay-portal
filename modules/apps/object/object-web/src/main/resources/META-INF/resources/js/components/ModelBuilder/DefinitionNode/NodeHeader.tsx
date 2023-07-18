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

import {ClayButtonWithIcon} from '@clayui/button';
import DropDown from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';
import ClayLabel from '@clayui/label';
import {sub} from 'frontend-js-web';
import React from 'react';

import './NodeHeader.scss';

interface INodeHeader {
	hasDeleteResourcePermission: boolean;
	hasManagePermissionsResourcePermission: boolean;
	hasObjectDefinitionPublished: boolean;
	isLinkedNode: boolean;
	objectDefinitionLabel: string;
	system: boolean;
}

export default function NodeHeader({
	hasDeleteResourcePermission,
	hasManagePermissionsResourcePermission,
	hasObjectDefinitionPublished,
	isLinkedNode,
	objectDefinitionLabel,
	system,
}: INodeHeader) {
	return (
		<div className="lfr-objects__model-builder-node-header-container">
			<div className="lfr-objects__model-builder-node-header-label-container">
				<div className="lfr-objects__model-builder-node-header-label-title">
					{isLinkedNode && (
						<ClayIcon className="c-pt-1 text-4" symbol="link" />
					)}

					<span>{objectDefinitionLabel}</span>
				</div>

				<DropDown
					alignmentPosition={3}
					trigger={
						<ClayButtonWithIcon
							aria-label={Liferay.Language.get('show-actions')}
							displayType="secondary"
							size="sm"
							symbol="ellipsis-v"
						/>
					}
				>
					<DropDown.ItemList>
						<DropDown.Item symbolRight="shortcut">
							{sub(
								Liferay.Language.get('edit-in-x'),
								Liferay.Language.get('page view')
							)}
						</DropDown.Item>

						<hr />

						<DropDown.Item>
							<ClayIcon
								className="c-mr-3 text-4"
								symbol="info-circle-open"
							/>

							{Liferay.Language.get('view-details')}
						</DropDown.Item>

						<hr />

						{hasManagePermissionsResourcePermission && (
							<>
								<DropDown.Item>
									<ClayIcon
										className="c-mr-3 text-4"
										symbol="users"
									/>

									{sub(
										Liferay.Language.get('manage-x'),
										Liferay.Language.get('permissions')
									)}
								</DropDown.Item>
								<hr />
							</>
						)}

						{hasDeleteResourcePermission && (
							<DropDown.Item>
								<ClayIcon
									className="c-mr-3 text-4"
									symbol="trash"
								/>

								{sub(
									Liferay.Language.get('delete-x'),
									Liferay.Language.get('object')
								)}
							</DropDown.Item>
						)}
					</DropDown.ItemList>
				</DropDown>
			</div>

			<div>
				{system ? (
					<ClayLabel displayType="info">
						{Liferay.Language.get('system')}
					</ClayLabel>
				) : (
					<ClayLabel displayType="warning">
						{Liferay.Language.get('custom')}
					</ClayLabel>
				)}

				{hasObjectDefinitionPublished ? (
					<ClayLabel displayType="success">
						{Liferay.Language.get('approved')}
					</ClayLabel>
				) : (
					<ClayLabel displayType="info">
						{Liferay.Language.get('draft')}
					</ClayLabel>
				)}
			</div>
		</div>
	);
}
