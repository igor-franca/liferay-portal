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

import ClayButton, {ClayButtonWithIcon} from '@clayui/button';
import DropDown from '@clayui/drop-down';
import ClayLabel from '@clayui/label';
import classNames from 'classnames';
import React, {useState} from 'react';
import {NodeProps} from 'react-flow-renderer';

import './ObjectDefinitionNode.scss';

import ClayIcon from '@clayui/icon';
import {sub} from 'frontend-js-web';

import {getBusinessTypeLabel} from '../../../utils/businessTypeLabel';

export function ObjectDefinitionNode(props: NodeProps) {
	const [showAll, setShowAll] = useState<boolean>(false);

	return (
		<div
			className={classNames('lfr-objects__model-builder-node-container', {
				'lfr-objects__model-builder-node-container-selected':
					props.data.nodeSelected,
			})}
		>
			<div className="lfr-objects__model-builder-node-header-container">
				<div className="lfr-objects__model-builder-node-label-container">
					<div className="lfr-objects__model-builder-node-label-title">
						{props.data.isLinkedNode && <ClayIcon className="c-pt-1 text-4" symbol="link" />}

						<span>{props.data.objectDefinitionLabel}</span>
					</div>

					<DropDown
						alignmentPosition={3}
						trigger={
							<ClayButtonWithIcon
								aria-label={Liferay.Language.get(
									'show-actions'
								)}
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

							{props.data
								.hasManagePermissionsResourcePermission && (
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

							{props.data.hasDeleteResourcePermission && (
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
					{props.data.system ? (
						<ClayLabel displayType="info">
							{Liferay.Language.get('system')}
						</ClayLabel>
					) : (
						<ClayLabel displayType="warning">
							{Liferay.Language.get('custom')}
						</ClayLabel>
					)}

					{props.data.hasObjectDefinitionPublished ? (
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

			{props.data.objectFields.map(
				(objectField: ObjectField, index: number) => {
					if (index < 5 || showAll) {
						return (
							<div
								className={classNames(
									'lfr-objects__model-builder-node-field',
									{
										'lfr-objects__model-builder-node-field-selected':
											objectField.selected,
									}
								)}
							>
								<div className="lfr-objects__model-builder-node-field-label">
									<span>{objectField.label}</span>

									{objectField.name === 'id' ? (
										<span>key</span>
									) : null}
								</div>

								<div className="lfr-objects__model-builder-node-field-business-type">
									<span>
										{getBusinessTypeLabel(
											objectField.businessType
										)}
									</span>
								</div>
							</div>
						);
					}
				}
			)}

			<div className="lfr-objects__model-builder-node-button-container">
				<DropDown
					alignmentPosition={4}
					trigger={
						<ClayButton displayType="secondary">
							<span>
								{sub(
									Liferay.Language.get('x-or-x'),
									Liferay.Language.get('field'),
									Liferay.Language.get('relationship'),
								)}
							</span>
						</ClayButton>
					}
				>
					<DropDown.ItemList>
						<DropDown.Item>
							<ClayIcon
								className="c-mr-3 text-4"
								symbol="custom-field"
							/>

							{Liferay.Language.get('add-field')}
						</DropDown.Item>

						<DropDown.Item>
							<ClayIcon
								className="c-mr-3 text-4"
								symbol="nodes"
							/>

							{sub(
								Liferay.Language.get('add-x'),
								Liferay.Language.get('relationship')
							)}
						</DropDown.Item>
					</DropDown.ItemList>
				</DropDown>
			</div>

			<div className="lfr-objects__model-builder-node-show-all-fields-container">
				<div
					className="lfr-objects__model-builder-node-show-all-fields-button"
					onClick={() => {
						setShowAll(!showAll);
					}}
					role="button"
				>
					{showAll ? (
						<>
							<span>
								{sub(
									Liferay.Language.get('hide-x'),
									Liferay.Language.get('fields')
								)}
							</span>
							<ClayIcon 
								className="c-pt-1 text-4"
								symbol="angle-up-small"
							/>
						</>
					) : (
						<>
							<span>
								{sub(
									Liferay.Language.get('show-all-x'),
									Liferay.Language.get('fields')
								)}
							</span>
							<ClayIcon 
								className="c-pt-1 text-4"
								symbol="angle-down-small"
							/>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
