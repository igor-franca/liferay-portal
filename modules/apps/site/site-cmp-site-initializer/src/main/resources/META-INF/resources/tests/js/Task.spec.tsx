/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import '@testing-library/jest-dom';
import {fireEvent, render, waitFor} from '@testing-library/react';
import React from 'react';

import Task from '../../js/components/props_transformer/views/kanban_view/components/Task';
import {KanbanViewContext} from '../../js/components/props_transformer/views/kanban_view/context';
import {mockNavigate} from '../../tests/js/__mocks__/frontend-js-web';

jest.mock('react-dnd', () => ({
	useDrag: () => [{isDragging: false}, jest.fn()],
}));

jest.mock('@clayui/drop-down', () => ({
	ClayDropDownWithItems: ({items}: any) => (
		<div>
			{items.map((item: any, index: number) =>
				item.type === 'divider' ? null : (
					<button key={index} onClick={item.onClick}>
						{item.label}
					</button>
				)
			)}
		</div>
	),
}));

const mockGetUserAccount = jest.fn();
const mockPatchTaskById = jest.fn();
const mockDeleteTaskById = jest.fn();

jest.mock('../../js/utils/api', () => ({
	deleteTaskById: (...args: any[]) => mockDeleteTaskById(...args),
	getUserAccount: (...args: any[]) => mockGetUserAccount(...args),
	patchTaskById: (...args: any[]) => mockPatchTaskById(...args),
}));

const mockOpenCMPModal = jest.fn();

jest.mock('../../js/utils/openCMPModal', () => ({
	openCMPModal: (...args: any[]) => mockOpenCMPModal(...args),
}));

const mockDisplayAssignSuccessToast = jest.fn();
const mockDisplayDeleteSuccessToast = jest.fn();

jest.mock('../../js/utils/toastUtil', () => ({
	displayAssignSuccessToast: (...args: any[]) =>
		mockDisplayAssignSuccessToast(...args),
	displayDeleteSuccessToast: (...args: any[]) =>
		mockDisplayDeleteSuccessToast(...args),
}));

const mockDisplayErrorToast = jest.fn();

jest.mock('@liferay/site-cms-site-initializer', () => ({
	displayErrorToast: (...args: any[]) => mockDisplayErrorToast(...args),
}));

afterEach(() => {
	jest.clearAllMocks();
});

describe('Kanban Task', () => {
	const task = {
		embedded: {
			assignTo: {name: 'Alice', portrait: 'p.jpg'},
			cmpProjectToCMPTasks: {title: 'Project A'},
			id: 42,
			state: {key: 'in-progress', name: 'In Progress'},
			title: 'Task title',
		},
	} as any;

	const renderTask = (itemsActions: any[] = []) =>
		render(
			<KanbanViewContext.Provider
				value={{
					boardData: {},
					changeTaskStatus: jest.fn(),
					dataSetId: 'dataSetId',
					itemsActions,
				}}
			>
				<Task {...task} />
			</KanbanViewContext.Provider>
		);

	it('assigns task to current user successfully', async () => {
		mockGetUserAccount.mockResolvedValue({
			externalReferenceCode: 'u1',
			name: 'Current User',
		});
		mockPatchTaskById.mockResolvedValue({error: null});

		const {getByText} = renderTask();

		fireEvent.click(getByText('assign-to-me'));

		await waitFor(() => {
			expect(mockPatchTaskById).toHaveBeenCalled();
			expect((global as any).Liferay.fire).toHaveBeenCalled();
			expect(mockDisplayAssignSuccessToast).toHaveBeenCalledWith(
				'Task title',
				'Current User'
			);
		});
	});

	it('navigates when edit and view actions are clicked', async () => {
		const itemsActions = [
			{data: {id: 'edit'}, href: '/edit/{embedded.id}'},
			{data: {id: 'actionLink'}, href: '/view/{embedded.id}'},
		];

		const {getByText} = renderTask(itemsActions);

		fireEvent.click(getByText('edit'));
		expect(mockNavigate).toHaveBeenCalledWith('/edit/42');

		fireEvent.click(getByText('view'));
		expect(mockNavigate).toHaveBeenCalledWith('/view/42');
	});

	it('opens assign-to modal', () => {
		const {getByText} = renderTask();

		fireEvent.click(getByText('assign-to-...'));

		expect(mockOpenCMPModal).toHaveBeenCalledTimes(1);
	});

	it('opens delete modal', () => {
		const {getByText} = renderTask();

		fireEvent.click(getByText('delete'));

		expect(mockOpenCMPModal).toHaveBeenCalledTimes(1);
	});

	it('renders task content', () => {
		const {getByText} = renderTask();

		expect(getByText('Task title')).toBeInTheDocument();
		expect(getByText('Project A')).toBeInTheDocument();
		expect(getByText('In Progress')).toBeInTheDocument();
	});

	it('shows error toast when assign-to-me fails', async () => {
		mockGetUserAccount.mockResolvedValue({
			externalReferenceCode: 'u1',
			name: 'Current User',
		});
		mockPatchTaskById.mockResolvedValue({error: 'error'});

		const {getByText} = renderTask();

		fireEvent.click(getByText('assign-to-me'));

		await waitFor(() => {
			expect(mockDisplayErrorToast).toHaveBeenCalledWith('error');
		});
	});
});
