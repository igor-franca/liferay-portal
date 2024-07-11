/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayCheckbox} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import {ClayTooltipProvider} from '@clayui/tooltip';
import React from 'react';

interface CheckboxParameterProps {
	checked: boolean;
	label: string;
	onChange: (values: boolean) => void;
	title: string;
	values: Partial<ObjectAction>;
}

import './CheckboxParameter.scss';

export function CheckboxParameter({
	checked,
	label,
	onChange,
	title,
	values,
}: CheckboxParameterProps) {
	return (
		<>
			<div className="lfr-object__action-builder-checkbox-parameter-container">
				<ClayCheckbox
					checked={checked}
					disabled={values.system}
					label={label}
					onChange={({target: {checked}}) => {
						onChange(checked);
					}}
				/>

				<ClayTooltipProvider>
					<div data-tooltip-align="top" title={title}>
						<ClayIcon
							className="lfr-object__action-builder-tooltip-icon"
							symbol="question-circle-full"
						/>
					</div>
				</ClayTooltipProvider>
			</div>
		</>
	);
}
