/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayInput} from '@clayui/form';
import React from 'react';

import {IMaskedNumber, NumericDataType} from './Numeric';
import LocalesDropdown from 'util/localizable/LocalesDropdown';

type InputMaskProps = {
	append: string;
	appendType: 'prefix' | 'suffix';
	children: React.ReactNode;
	dataType: NumericDataType;
	inputValue: IMaskedNumber;
	name: string;
};

const InputMask = ({
	append,
	appendType,
	children,
	dataType,
	inputValue,
	name,
}: InputMaskProps) => (
	<>
		<ClayInput.Group>
			{append && dataType === 'double' &&  appendType === 'prefix' && (
				<ClayInput.GroupItem prepend shrink>
					<ClayInput.GroupText>{append}</ClayInput.GroupText>
				</ClayInput.GroupItem>
			)}

			<ClayInput.GroupItem prepend>{children}</ClayInput.GroupItem>

			{append && dataType === 'double' && appendType === 'suffix' && (
				<ClayInput.GroupItem append shrink>
					<ClayInput.GroupText>{append}</ClayInput.GroupText>
				</ClayInput.GroupItem>
			)}
		</ClayInput.Group>

		{inputMask && (
			<input name={name} type="hidden" value={inputValue.raw} />
		)}
	</>
);

export default InputMask;
