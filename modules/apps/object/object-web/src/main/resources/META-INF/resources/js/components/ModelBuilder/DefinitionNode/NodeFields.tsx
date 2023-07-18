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
import React from 'react';

import {getBusinessTypeLabel} from '../../../utils/businessTypeLabel';
import {FieldNode} from '../types';

import './NodeFields.scss';

interface INodeFields {
	objectFields: FieldNode[];
	showAll: boolean;
}

export default function NodeFields({objectFields, showAll}: INodeFields) {
	return (
		<>
			{objectFields.map((objectField: FieldNode, index: number) => {
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
			})}
		</>
	);
}
