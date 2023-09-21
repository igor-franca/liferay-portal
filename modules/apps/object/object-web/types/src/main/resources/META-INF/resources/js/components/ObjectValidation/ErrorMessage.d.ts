/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';
import {ObjectValidationErrors} from './useObjectValidationForm';
declare type ErrorMessageProps = {
	children: React.ReactNode;
	disabled: boolean;
	errors: ObjectValidationErrors;
	setValidation: (values: Partial<ObjectValidation>) => void;
	validation: Partial<ObjectValidation>;
};
export declare function ErrorMessage({
	children,
	disabled,
	errors,
	setValidation,
	validation,
}: ErrorMessageProps): JSX.Element;
export {};
