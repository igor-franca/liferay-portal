/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {FrontendDataSetContext} from '@liferay/frontend-data-set-web';
import {useContext, useEffect, useState} from 'react';

import {TreeTask} from '../types';
import {flattenTreeTasks} from '../utils/treeTasks';

/**
 * Tells the data set every row the view has loaded, subtasks included, so
 * selection and Select All see them. In the tree, the total counts tasks and
 * subtasks, since Select All reaches both.
 */
export default function useLoadedTasksReport({
	countAllTasks,
	flat,
	treeTasks,
}: {
	countAllTasks: () => Promise<number>;
	flat: boolean;
	treeTasks: TreeTask[];
}) {
	const {onViewItemsChange} = useContext(FrontendDataSetContext);

	const [allTasksCount, setAllTasksCount] = useState<number>();

	useEffect(() => {
		if (flat) {
			return;
		}

		countAllTasks()
			.then(setAllTasksCount)
			.catch(() => setAllTasksCount(undefined));
	}, [countAllTasks, flat]);

	useEffect(() => {
		onViewItemsChange?.({
			items: flattenTreeTasks(treeTasks),
			total: flat ? undefined : allTasksCount,
		});
	}, [allTasksCount, flat, onViewItemsChange, treeTasks]);

	useEffect(() => () => onViewItemsChange?.(null), [onViewItemsChange]);
}
