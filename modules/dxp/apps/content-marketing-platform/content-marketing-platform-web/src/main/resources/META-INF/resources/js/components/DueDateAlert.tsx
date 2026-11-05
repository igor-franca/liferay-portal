/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayAlert from '@clayui/alert';
import {sub} from 'frontend-js-web';
import React, {useEffect, useState} from 'react';

const getDueDate = () =>
	document.querySelector<HTMLInputElement>('[name="ObjectField_dueDate"]')
		?.value;

export default function DueDateAlert({parentDueDate}: {parentDueDate: string}) {
	const [dueDate, setDueDate] = useState(getDueDate);

	useEffect(() => {
		const handleChange = () => setDueDate(getDueDate());

		document.addEventListener('change', handleChange);

		return () => document.removeEventListener('change', handleChange);
	}, []);

	if (!dueDate || dueDate <= parentDueDate) {
		return null;
	}

	return (
		<ClayAlert displayType="info" variant="feedback">
			{sub(
				Liferay.Language.get('this-date-is-after-the-parent-task-due-date-x'),
				new Date(`${parentDueDate}T00:00`).toLocaleDateString(
					Liferay.ThemeDisplay.getBCP47LanguageId()
				)
			)}
		</ClayAlert>
	);
}
