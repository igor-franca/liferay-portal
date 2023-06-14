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

import {API, FormError, openToast} from '@liferay/object-js-components-web';

function setAccountRelationshipFieldMandatory(
	values: Partial<ObjectDefinition>
) {
	const {objectFields} = values;

	const newObjectFields = objectFields?.map((field) => {
		if (field.name === values.accountEntryRestrictedObjectFieldName) {
			return {
				...field,
				required: true,
			};
		}

		return field;
	});

	return {
		...values,
		objectFields: newObjectFields,
	};
}

export async function onSubmitObjectDefinition(
	draft: boolean,
	handleValidate: () => FormError<ObjectDefinition>,
	values: Partial<ObjectDefinition>
) {
	const validationErrors = handleValidate();

	if (!Object.keys(validationErrors).length) {
		delete values.objectRelationships;
		delete values.objectActions;
		delete values.objectLayouts;
		delete values.objectViews;

		let objectDefinition = values;

		if (values.accountEntryRestricted) {
			objectDefinition = setAccountRelationshipFieldMandatory(values);
		}

		const saveResponse = await API.putObjectDefinitionByExternalReferenceCode(
			objectDefinition
		);

		if (!saveResponse.ok) {
			const {title} = (await saveResponse.json()) as {
				status: string;
				title: string;
			};

			openToast({
				message: title,
				type: 'danger',
			});

			return;
		}

		if (!draft) {
			const publishResponse = await API.publishObjectDefinitionById(
				values.id as number
			);

			if (!publishResponse.ok) {
				const {title} = (await publishResponse.json()) as {
					status: string;
					title: string;
				};

				openToast({
					message: title,
					type: 'danger',
				});

				return;
			}

			openToast({
				message: Liferay.Language.get(
					'the-object-was-published-successfully'
				),
				type: 'success',
			});

			setTimeout(() => window.location.reload(), 1000);

			return;
		}

		openToast({
			message: Liferay.Language.get('the-object-was-saved-successfully'),
			type: 'success',
		});

		setTimeout(() => window.location.reload(), 1000);
	}
}
