/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {FrontendDataSetContext} from '@liferay/frontend-data-set-web';
import {useContext, useEffect, useRef, useState} from 'react';

import {ITask} from '../../../../../utils/types';
import {ITasksPage, TreeTask} from '../types';
import {appendTreeTasks, toTreeTask} from '../utils/treeTasks';

/**
 * Keeps the top-level tasks of the view. The first batch is the data set
 * response, and the next batches load when the sentinel below the table
 * scrolls into view.
 */
export default function useTaskBatches({
	batchSize,
	items,
	onBatchLoaded,
}: {
	batchSize: number;
	items: ITask[];
	onBatchLoaded: (batchItemsCount: number) => void;
}) {
	const {requestItems} = useContext(FrontendDataSetContext);

	const [failed, setFailed] = useState(false);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [totalCount, setTotalCount] = useState<number>();
	const [treeTasks, setTreeTasks] = useState<TreeTask[]>(() =>
		items.map(toTreeTask)
	);

	const sentinelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setFailed(false);
		setPage(1);
		setTotalCount(undefined);
		setTreeTasks(items.map(toTreeTask));
	}, [items]);

	const hasMore =
		!failed &&
		(totalCount === undefined
			? items.length >= batchSize
			: treeTasks.length < totalCount);

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
					setPage(tasksPage.page);
					setTotalCount(tasksPage.totalCount);
					setTreeTasks((treeTasks) =>
						appendTreeTasks(treeTasks, tasksPage.items)
					);

					onBatchLoaded(tasksPage.items.length);
				})
				.catch(() => setFailed(true))
				.finally(() => setLoading(false));
		});

		intersectionObserver.observe(sentinel);

		return () => intersectionObserver.disconnect();
	}, [batchSize, hasMore, loading, onBatchLoaded, page, requestItems]);

	return {loading, sentinelRef, setTreeTasks, treeTasks};
}
