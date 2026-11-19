/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayCheckbox} from '@clayui/form';
import {FrontendDataSetContext} from '@liferay/frontend-data-set-web';
import {sub} from 'frontend-js-web';
import React, {useContext} from 'react';

import {TreeTask} from '../types';

export default function TaskSelectionCheckbox({
	onSelectionChange,
	treeTask,
}: {
	onSelectionChange: (treeTask: TreeTask) => void;
	treeTask: TreeTask;
}) {
	const {allItemsSelectedActive, selectedItemsValue} = useContext(
		FrontendDataSetContext
	);

	const selectedValues: unknown[] = selectedItemsValue ?? [];

	return (
		<ClayCheckbox
			aria-label={sub(
				Liferay.Language.get('select-x'),
				treeTask.embedded.title
			)}
			checked={
				allItemsSelectedActive || selectedValues.includes(treeTask.id)
			}
			onChange={() => onSelectionChange(treeTask)}
		/>
	);
}
