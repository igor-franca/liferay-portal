/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayInput} from '@clayui/form';
import React, {useState} from 'react';
import LocalesDropdown, {EditingLocale} from 'util/localizable/LocalesDropdown';
import {getEditingLocales, getLocale} from './util/locales';
import NumericBase from 'Numeric/NumericBase';
import {IProps} from 'Numeric/Numeric';

export default function NumericLocalizedObjectField(props: IProps) {
	const {availableLocales, dataType, defaultLocale, defaultLanguageId, fieldName, onChange, symbols, value} = props;

	const initialEditingLocales = getEditingLocales(
		availableLocales,
		defaultLocale,
		value ?? {["en_US"]: ''}
	);

	const [editingLocales, setEditingLocales] = useState<EditingLocale[]>(
		initialEditingLocales
	);

	const [currentEditingLocale, setCurrentEditingLocale] = useState({
		...getLocale(editingLocales, defaultLocale, defaultLocale.localeId),
	});

	const handleTranslationChange = (localeId: Liferay.Language.Locale) => {
		if (typeof value === 'object' && !Object.hasOwn(value, localeId)) {
			let defaultValue = String(value[defaultLanguageId]);

			if (dataType === 'double' &&  value[defaultLanguageId] !== undefined) {
				const symbolsValue =  defaultValue.match(/[^-\d]/g);
	
				defaultValue = symbolsValue
					? defaultValue.replace(symbolsValue[0], '.')
					: defaultValue;
			}

			const newValue = {
				...value,
				[localeId]: defaultValue,
			};
			
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
			<NumericBase {...props} editingLocale={currentEditingLocale}/>

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