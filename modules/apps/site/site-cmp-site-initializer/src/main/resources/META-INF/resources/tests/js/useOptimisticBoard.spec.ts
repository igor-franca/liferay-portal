/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {act, renderHook} from '@testing-library/react-hooks';
import {useOptimisticBoard} from '../../js/components/props_transformer/views/kanban_view/hooks/useOptimisticBoard';
import {ITask} from '../../js/utils/types';
import {RequestResult} from '@liferay/site-cms-site-initializer/src/main/resources/META-INF/resources/js/common/services/ApiHelper';

const mockTasks = [
	{
		embedded: {
			id: 1,
			state: {key: 'inProgress', name: 'In Progress'},
			title: 'Task 1',
		},
	},
	{
		embedded: {
			id: 2,
			state: {key: 'notStarted', name: 'To Do'},
			title: 'Task 2',
		},
	},
] as ITask[];

describe('useOptimisticBoard', () => {
	it('should initialize with the correct board data', () => {
		const onTaskMoveApi = jest.fn();

		const {result} = renderHook(() =>
			useOptimisticBoard(mockTasks, onTaskMoveApi)
		);

		expect(result.current.boardData['inProgress'].tasks).toHaveLength(1);
		expect(result.current.boardData['notStarted'].tasks).toHaveLength(1);
		expect(result.current.boardData['done'].tasks).toHaveLength(0);
	});

	it('should optimistically update the board when a task is moved', async () => {
		const onTaskMoveApi = jest.fn(
			() => new Promise<RequestResult<ITask>>((resolve) => setTimeout(() => resolve({error: null} as RequestResult<ITask>), 100))
		);

		const {result, waitForNextUpdate} = renderHook(() =>
			useOptimisticBoard(mockTasks, onTaskMoveApi)
		);

		const taskToMove = mockTasks[0];
		const newStatus = {key: 'done', name: 'Done'};

		act(() => {
			result.current.moveTask(taskToMove, newStatus);
		});

		expect(result.current.boardData['inProgress'].tasks).toHaveLength(0);
		expect(result.current.boardData['notStarted'].tasks).toHaveLength(1);
		expect(result.current.boardData['done'].tasks[0].embedded.id).toBe(
			taskToMove.embedded.id
		);

		await waitForNextUpdate();
	});

	it('should revert the optimistic update if the API call fails', async () => {
		const onTaskMoveApi = jest.fn(() => Promise.resolve({error: 'API Error'} as RequestResult<ITask>));

		const {result, waitForNextUpdate} = renderHook(() =>
			useOptimisticBoard(mockTasks, onTaskMoveApi)
		);

		const taskToMove = mockTasks[0];
		const newStatus = {key: 'done', name: 'Done'};

		act(() => {
			result.current.moveTask(taskToMove, newStatus);
		});

		expect(result.current.boardData['inProgress'].tasks).toHaveLength(0);
		expect(result.current.boardData['done'].tasks).toHaveLength(1);

		await waitForNextUpdate();

		expect(result.current.boardData['inProgress'].tasks).toHaveLength(1);
		expect(result.current.boardData['done'].tasks).toHaveLength(0);
	});

	it('should update the server state when the API call is successful', async () => {
		const onTaskMoveApi = jest.fn(() => Promise.resolve({error: null} as RequestResult<ITask>));

		const {result, waitForNextUpdate} = renderHook(() =>
			useOptimisticBoard(mockTasks, onTaskMoveApi)
		);

		const taskToMove = mockTasks[0];
		const newStatus = {key: 'done', name: 'Done'};

		act(() => {
			result.current.moveTask(taskToMove, newStatus);
		});

		expect(result.current.boardData['inProgress'].tasks).toHaveLength(0);
		expect(result.current.boardData['done'].tasks).toHaveLength(1);

		await waitForNextUpdate();

		expect(result.current.boardData['inProgress'].tasks).toHaveLength(0);
		expect(result.current.boardData['done'].tasks).toHaveLength(1);
	});
});
