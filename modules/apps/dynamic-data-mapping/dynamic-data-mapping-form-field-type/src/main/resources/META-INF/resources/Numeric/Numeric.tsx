/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

// @ts-ignore

import React, {FocusEventHandler} from 'react';
import {ClayInput} from '@clayui/form';

import FieldBase from '../FieldBase/ReactFieldBase.es';
import {ISymbols} from '../NumericInputMask/NumericInputMask';

// @ts-ignore

import withConfirmationField from '../util/withConfirmationField.es';

import NumericLocalizedObjectField from 'localizedObjectFields/NumericLocalizedObjectField';
import NumericBase from './NumericBase';
import type {FieldChangeEventHandler, Locale, LocalizedValue} from '../types';
import {EditingLocale} from 'util/localizable/LocalesDropdown';

import './Numeric.scss';

const Numeric = ({
	localizedObjectField,
	localizedValue,
	...otherProps
}: IProps) => {
	const Component =
		Liferay.FeatureFlags['LPD-32050'] && localizedObjectField
			? NumericLocalizedObjectField
			: NumericBase;

	return (
		<FieldBase {...(!localizedObjectField && {localizedValue})} {...otherProps}>
			<ClayInput.Group>
				<Component localizedObjectField={localizedObjectField} {...otherProps} />
			</ClayInput.Group>
		</FieldBase>
	);
}

export {Numeric};
export default withConfirmationField(Numeric);

export type IProps = {
	append: string;
	appendType: 'prefix' | 'suffix';
	availableLocales: EditingLocale[];
	dataType: NumericDataType;
	decimalPlaces: number;
	defaultLocale: EditingLocale;
	defaultLanguageId: Locale;
	editingLocale: EditingLocale;
	errorMessage?: string;
	fieldName: string;
	focused: boolean;
	htmlAutocompleteAttribute: string;
	id: string;
	inputMask?: boolean;
	inputMaskFormat?: string;
	localizedSymbols?: LocalizedValue<ISymbols>;
	localizedValue?: LocalizedValue<string>;
	localizedObjectField: boolean;
	name: string;
	onBlur: FocusEventHandler<HTMLInputElement>;
	onChange: FieldChangeEventHandler<string | LocalizedValue<string>>;
	onFocus: FocusEventHandler<HTMLInputElement>;
	placeholder?: string;
	predefinedValue?: string;
	readOnly: boolean;
	required?: boolean;
	settingsContext?: any;
	symbols: ISymbols;
	tip?: string;
	valid?: boolean;
	value: string | LocalizedValue<string>;
}

export type NumericDataType = 'integer' | 'double';
