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

import ClayButton from '@clayui/button';
import DropDown from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';
import {sub} from 'frontend-js-web';
import React from 'react';

import './NodeFooter.scss';

interface NodeFooter {
	setShowAllFields: (value: boolean) => void;
	showAllFields: boolean;
}

export default function NodeFooter({
	setShowAllFields,
	showAllFields,
}: NodeFooter) {
	return (
		<>
			<div className="lfr-objects__model-builder-node-button-container">
				<DropDown
					alignmentPosition={4}
					trigger={
						<ClayButton displayType="secondary">
							<span>
								{sub(
									Liferay.Language.get('x-or-x'),
									Liferay.Language.get('add-field'),
									Liferay.Language.get('relationship')
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
						setShowAllFields(!showAllFields);
					}}
					role="button"
				>
					{showAllFields ? (
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
		</>
	);
}
