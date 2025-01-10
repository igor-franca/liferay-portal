/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

// @ts-ignore

import {SettingsContext} from 'data-engine-js-components-web';
import React, {ChangeEventHandler, useMemo} from 'react';

import {ClayInput} from '@clayui/form';
import {ClayTooltipProvider} from '@clayui/tooltip';
import classNames from 'classnames';
import {getTooltipTitle} from 'util/tooltip';

import {NumericProps} from './Numeric';
import {ISymbols} from 'NumericInputMask/NumericInputMask';
import {formatValue, getFormattedValue, getMaskedValue, getValue, IMaskedNumber} from 'localizedObjectFields/util/numericUtil';
import {LocalizedValue} from 'types';

const NumericBase = ({
	append,
	appendType,
	dataType,
	decimalPlaces,
	defaultLanguageId,
	editingLocale,
	focused,
	errorMessage,
	htmlAutocompleteAttribute,
	id,
	inputMask,
	inputMaskFormat,
	localizedObjectField,
	localizedValue,
	localizedSymbols,
	name,
	onChange,
	onBlur,
	onFocus,
	placeholder,
	predefinedValue,
	readOnly,
	required,
	symbols: symbolsProp = {decimalSymbol: '.'},
	settingsContext,
	tip,
	valid,
	value,
}: Omit<NumericProps, 'availableLocales' | 'fieldName'>) => {
	const accessibleProperties = {
		...(tip && {
			'aria-describedby': `${id ?? name}_fieldHelp`,
		}),
		...(errorMessage && {
			'aria-errormessage': `${id ?? name}_fieldError`,
		}),
		'aria-invalid': !valid,
		'aria-required': required,
	};

	const localizedSymbolsContext = settingsContext
		? SettingsContext.getSettingsContextProperty(
				settingsContext,
				'predefinedValue',
				'localizedSymbols'
			)
		: localizedSymbols;

	const symbols = useMemo<ISymbols>(() => {
		if (inputMask) {
			return {
				decimalSymbol: symbolsProp.decimalSymbol,
				thousandsSeparator:
					symbolsProp.thousandsSeparator === 'none'
						? null
						: symbolsProp.thousandsSeparator,
			};
		}	

		return localizedSymbolsContext?.[editingLocale.localeId] || symbolsProp;
	}, [editingLocale.localeId, inputMask, localizedSymbolsContext, symbolsProp]);

	// tentar remover a passagem do lacalized value no caso do numericLocalizedObjectField

	const inputValue = useMemo<IMaskedNumber>(() => {
		let newValue =
			getValue({editingLanguageId: editingLocale.localeId, localizedObjectField, value}) ??
			getValue({editingLanguageId: defaultLanguageId, localizedObjectField, value}) ??
			localizedValue?.[editingLocale.localeId] ??
			localizedValue?.[defaultLanguageId] ??
			predefinedValue ??
			'';

		if (dataType === 'double') {
			const symbolsValue = newValue.match(/[^-\d]/g);

			newValue = symbolsValue
				? newValue.replace(symbolsValue[0], symbols.decimalSymbol)
				: newValue;
		}

		return inputMask
			? getMaskedValue({
					dataType,
					decimalPlaces,
					focused,
					includeThousandsSeparator: Boolean(
						symbols.thousandsSeparator
					),
					inputMaskFormat: String(inputMaskFormat),
					symbols,
					value: newValue,
				})
			: {
					...getFormattedValue({
						dataType,
						decimalSymbol: symbols.decimalSymbol,
						value: newValue,
					}),
					placeholder,
				};
	}, [
		dataType,
		decimalPlaces,
		defaultLanguageId,
		editingLocale.localeId,
		focused,
		inputMask,
		inputMaskFormat,
		localizedValue,
		placeholder,
		predefinedValue,
		symbols,
		value,
	]);

	const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const targetValue = event.target.value;

		const formatedValue = formatValue({
			dataType: dataType,
			decimalPlaces,
			focused,
			inputMask,
			inputMaskFormat,
			inputValue,
			symbols,
			value: targetValue
		});

		if (localizedObjectField && formatedValue && formatedValue.masked !== inputValue.masked) {
			const localazedValue = {	
				...(value as LocalizedValue<string>),
				[editingLocale.localeId]: formatedValue.raw,
			};

			onChange({target: {value: localazedValue}});
		}
		else if (formatedValue){
			onChange({target: {value: formatedValue.raw}});
		}
	};

	return (
		<>
			{append && dataType === 'double' &&  appendType === 'prefix' && (
				<ClayInput.GroupItem prepend shrink>
					<ClayInput.GroupText>{append}</ClayInput.GroupText>
				</ClayInput.GroupItem>
			)}

			<ClayInput.GroupItem prepend>
				<ClayTooltipProvider>
					<div
						data-tooltip-align="top"
						{...getTooltipTitle({
							placeholder: inputValue.placeholder!,
							value: inputValue.masked,
						})}
					>
						<ClayInput
							{...accessibleProperties}
							{...(htmlAutocompleteAttribute && {
								autoComplete: htmlAutocompleteAttribute,
							})}
							className={classNames({
								'ddm-form-field-type__numeric--rtl':
									Liferay.Language.direction[editingLocale.localeId] ===
									'rtl',
							})}
							disabled={readOnly}
							id={id ?? name}
							name={name}
							onBlur={onBlur}
							onChange={handleChange}
							onFocus={onFocus}
							placeholder={inputValue.placeholder}
							type="text"
							value={inputValue.masked}
						/>
					</div>
				</ClayTooltipProvider>
			</ClayInput.GroupItem>

			{append && dataType === 'double' && appendType === 'suffix' && (
				<ClayInput.GroupItem append shrink>
					<ClayInput.GroupText>{append}</ClayInput.GroupText>
				</ClayInput.GroupItem>
			)}

			{inputMask && (
				<input name={name} type="hidden" value={inputValue.raw} />
			)}
		</>
	)};

export default NumericBase;
