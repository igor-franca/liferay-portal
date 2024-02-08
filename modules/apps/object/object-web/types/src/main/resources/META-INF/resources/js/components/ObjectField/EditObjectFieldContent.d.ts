/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {ElementType} from 'react';
import {EditObjectFieldProps} from './EditObjectField';
import {ObjectFieldErrors} from './ObjectFieldFormBase';
import './EditObjectFieldContent.scss';
interface EditObjectFieldContentProps
	extends Omit<
		EditObjectFieldProps,
		| 'forbiddenChars'
		| 'forbiddenLastChars'
		| 'forbiddenNames'
		| 'objectDefinitionExternalReferenceCode'
		| 'objectFieldId'
	> {
	containerWrapper: ElementType;
	dbObjectFieldRequired?: boolean;
	errors: ObjectFieldErrors;
	handleChange: React.ChangeEventHandler<HTMLInputElement>;
	modelBuilder?: boolean;
	objectDefinition: Pick<
		ObjectDefinition,
		| 'accountEntryRestricted'
		| 'accountEntryRestrictedObjectFieldName'
		| 'externalReferenceCode'
		| 'modifiable'
		| 'name'
		| 'status'
	>;
	onSubmit?: (editedObjectField?: Partial<ObjectField>) => void;
	setDbObjectFieldRequired?: (value: boolean) => void;
	setValues: (values: Partial<ObjectField>) => void;
	values: Partial<ObjectField>;
}
export declare function EditObjectFieldContent({
	baseResourceURL,
	containerWrapper,
	creationLanguageId,
	dbObjectFieldRequired,
	errors,
	filterOperators,
	handleChange,
	isDefaultStorageType,
	isRootDescendantNode,
	learnResources,
	modelBuilder,
	objectDefinition,
	onSubmit,
	readOnly,
	setDbObjectFieldRequired,
	setValues,
	values,
	workflowStatuses,
}: EditObjectFieldContentProps): JSX.Element;
export {};
