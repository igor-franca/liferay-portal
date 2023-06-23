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
import {ClayInput} from '@clayui/form';
import React from 'react';

import {FieldBase} from '../FieldBase';

interface ExpressionBuilderProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	buttonDisabled?: boolean;
	component?: 'input' | 'textarea' | React.ForwardRefExoticComponent<any>;
	disabled?: boolean;
	error?: string;
	feedbackMessage?: string;
	hideFeedback?: boolean;
	id?: string;
	label?: string;
	name?: string;
	onOpenModal: () => void;
	required?: boolean;
	type?: 'number' | 'text';
	value?: string | number | string[];
}

export function ExpressionBuilder({
	buttonDisabled,
	className,
	component,
	disabled,
	error,
	feedbackMessage,
	hideFeedback,
	id,
	label,
	name,
	onChange,
	onInput,
	onOpenModal,
	required,
	type,
	value,
	...otherProps
}: ExpressionBuilderProps) {
	return (
		<FieldBase
			className={className}
			disabled={disabled}
			errorMessage={error}
			helpMessage={feedbackMessage}
			hideFeedback={hideFeedback}
			id={id}
			label={label}
			required={required}
		>
			<ClayInput.Group>
				<ClayInput.GroupItem prepend>
					<ClayInput
						{...otherProps}
						component={component}
						disabled={disabled}
						id={id}
						name={name}
						onChange={onChange}
						onInput={onInput}
						type={type}
						value={value}
					/>
				</ClayInput.GroupItem>

				<ClayInput.GroupItem append shrink>
					<ClayButtonWithIcon
						aria-label={Liferay.Language.get('expand-input-area')}
						disabled={buttonDisabled}
						displayType="secondary"
						onClick={() => onOpenModal()}
						symbol="code"
						title={Liferay.Language.get('expand-input-area')}
					/>
				</ClayInput.GroupItem>
			</ClayInput.Group>
		</FieldBase>
	);
}
