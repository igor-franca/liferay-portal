/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayInput} from '@clayui/form';
import React, {useState} from 'react';
import LocalesDropdown, {EditingLocale} from 'util/localizable/LocalesDropdown';
import {getEditingLocales, getLocale} from './util/locales';
import NumericBase from 'Numeric/NumericBase';
import {NumericProps} from 'Numeric/Numeric';
import { LocalizedValue } from 'types';

export default function NumericLocalizedObjectField({
		availableLocales,
		dataType,
		defaultLocale,
		defaultLanguageId,
		fieldName,
		onChange,
		value,
		...otherProps
	}: Omit<NumericProps, 'value'> & {value: string | LocalizedValue<string>}
) {
	const initialEditingLocales = getEditingLocales(
		availableLocales,
		defaultLocale,
		value ?? {["en_US"]: ''}
	);

	const [editingLocales, setEditingLocales] = useState<EditingLocale[]>(
		initialEditingLocales
	);

	const [localizedValue, setLocalizedValue] = useState(value);

	const [currentEditingLocale, setCurrentEditingLocale] = useState({
		...getLocale(editingLocales, defaultLocale, defaultLocale.localeId),
	});

	const handleTranslationChange = (localeId: Liferay.Language.Locale) => {
		if (typeof value === 'object' && !Object.hasOwn(value, localeId)) {
			let formatedValue = value[defaultLanguageId] ?? '';

			if (dataType === 'double' &&  value[defaultLanguageId] !== undefined) {
				const symbolsValue =  formatedValue.match(/[^-\d]/g);
	
				formatedValue = symbolsValue
					? formatedValue.replace(symbolsValue[0], '.')
					: formatedValue;
			}

			const newValue = {
				...value,
				[localeId]: formatedValue,
			};
			
			setLocalizedValue(newValue);
			onChange({target: {value: newValue}});
		}


		const currentLocale = getLocale(
			editingLocales,
			defaultLocale,
			localeId
		);

		const updatedLocale = {...currentLocale, isTranslated: true};

		setEditingLocales((previous) =>
			previous.map((locale) =>
				locale.localeId === localeId ? updatedLocale : locale
			)
		);

		setCurrentEditingLocale(updatedLocale);
	};

	return (
		<>
			<NumericBase
				{...otherProps}
				dataType={dataType}
				defaultLocale={defaultLocale}
				defaultLanguageId={defaultLanguageId}
				editingLocale={currentEditingLocale}
				onChange={onChange}
				value={value}
			/>

			<ClayInput.GroupItem shrink>
				<LocalesDropdown
					availableLocales={availableLocales}
					editingLocale={currentEditingLocale}
					fieldName={fieldName}
					onLanguageClicked={handleTranslationChange}
				/>
			</ClayInput.GroupItem>
		</>
	);
}