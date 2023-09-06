/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayButtonWithIcon} from '@clayui/button';
import {ClayInput} from '@clayui/form';
import {FieldBase} from 'frontend-js-components-web';
import React from 'react';

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
						onClick={onOpenModal}
						symbol="code"
						title={Liferay.Language.get('expand-input-area')}
					/>
				</ClayInput.GroupItem>
			</ClayInput.Group>
		</FieldBase>
	);
}
