/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {FrontendDataSetContext} from '@liferay/frontend-data-set-web';
import {useContext, useEffect, useRef, useState} from 'react';

import {ITask} from '../../../../../utils/types';
import {ITasksPage, TreeTask} from '../types';
import {mergeTreeTasks, toTreeTask} from '../utils/treeTasks';

/**
 * The data set items are the loaded top-level tasks. The next batches load
 * when the sentinel below the table scrolls into view, and they are appended
 * to the data set items, so selection and Select All see them as any other
 * row. In the tree, the data set total counts tasks and subtasks, since
 * Select All reaches both.
 */
export default function useTaskBatches({
	batchSize,
	countAllTasks,
	flat,
	items,
	onBatchLoaded,
}: {
	batchSize: number;
	countAllTasks: () => Promise<number>;
	flat: boolean;
	items: ITask[];
	onBatchLoaded: (batchItemsCount: number) => void;
}) {
	const {requestItems, updateDataSetItems} = useContext(
		FrontendDataSetContext
	);

	const [allTasksCount, setAllTasksCount] = useState<number>();
	const [failed, setFailed] = useState(false);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [topLevelTasksCount, setTopLevelTasksCount] = useState<number>();
	const [treeTasks, setTreeTasks] = useState<TreeTask[]>(() =>
		items.map(toTreeTask)
	);

	const itemsRef = useRef(items);
	const sentinelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		itemsRef.current = items;

		setTreeTasks((treeTasks) => mergeTreeTasks(treeTasks, items));
	}, [items]);

	useEffect(() => {
		if (flat) {
			return;
		}

		countAllTasks()
			.then((count) => {
				setAllTasksCount(count);

				updateDataSetItems({
					items: itemsRef.current,
					lastPage: page,
					page,
					totalCount: count,
				});
			})
			.catch(() => setAllTasksCount(undefined));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [countAllTasks, flat]);

	const hasMore =
		!failed &&
		(topLevelTasksCount === undefined
			? items.length >= batchSize
			: items.length < topLevelTasksCount);

	useEffect(() => {
		const sentinel = sentinelRef.current;

		if (!sentinel || !hasMore || loading || !requestItems) {
			return;
		}

		const intersectionObserver = new IntersectionObserver((entries) => {
			if (!entries.some((entry) => entry.isIntersecting)) {
				return;
			}

			intersectionObserver.disconnect();

			setLoading(true);

			requestItems({delta: batchSize, page: page + 1})
				.then((tasksPage: ITasksPage) => {
					const ids = new Set(
						itemsRef.current.map((item) => item.embedded.id)
					);

					setPage(tasksPage.page);
					setTopLevelTasksCount(tasksPage.totalCount);

					updateDataSetItems({
						items: [
							...itemsRef.current,
							...tasksPage.items.filter(
								(item) => !ids.has(item.embedded.id)
							),
						],
						lastPage: tasksPage.page,
						page: tasksPage.page,
						totalCount: flat
							? tasksPage.totalCount
							: (allTasksCount ?? tasksPage.totalCount),
					});

					onBatchLoaded(tasksPage.items.length);
				})
				.catch(() => setFailed(true))
				.finally(() => setLoading(false));
		});

		intersectionObserver.observe(sentinel);

		return () => intersectionObserver.disconnect();
	}, [
		allTasksCount,
		batchSize,
		flat,
		hasMore,
		loading,
		onBatchLoaded,
		page,
		requestItems,
		updateDataSetItems,
	]);

	return {loading, sentinelRef, setTreeTasks, treeTasks};
}
