/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import '@testing-library/jest-dom';
import {act, fireEvent, render, screen} from '@testing-library/react';
import React from 'react';

import CalendarView from '../../js/components/props_transformer/views/calendar_view/CalendarView';

const mockChangeView = jest.fn();
const mockFullCalendarProps: {current: any} = {current: null};

// FullCalendar cannot run under jsdom, so it is mocked at the perimeter: the
// mock captures the props CalendarView passes (to fire callbacks like
// datesSet from the tests) and exposes a fake imperative API through the ref.

jest.mock('@fullcalendar/daygrid', () => ({
	__esModule: true,
	default: {},
}));

jest.mock('@fullcalendar/react', () => {
	const React = require('react');

	return {
		__esModule: true,
		default: React.forwardRef((props: any, ref: any) => {
			React.useEffect(() => {
				mockFullCalendarProps.current = props;
			});

			React.useImperativeHandle(ref, () => ({
				getApi: () => ({
					changeView: mockChangeView,
					gotoDate: jest.fn(),
					next: jest.fn(),
					prev: jest.fn(),
					today: jest.fn(),
					updateSize: jest.fn(),
				}),
			}));

			return null;
		}),
	};
});

jest.mock('@liferay/object-dynamic-data-mapping-form-field-type', () => ({
	AssigneeAvatar: ({name, portrait}: {name: string; portrait: string}) => (
		<img alt={name} src={portrait} />
	),
}));

jest.mock('@liferay/site-cms-site-initializer', () => ({
	displayErrorToast: jest.fn(),
	displayRequestSuccessToast: jest.fn(),
}));

jest.mock('../../js/utils/api', () => ({
	deleteTaskById: jest.fn(),
	getUserAccount: jest.fn(),
	patchTaskById: jest.fn(),
	postSubscribeTaskByExternalReferenceCode: jest.fn(),
	postUnsubscribeTaskByExternalReferenceCode: jest.fn(),
}));

jest.mock('../../js/utils/openCMPModal', () => ({
	openCMPModal: jest.fn(),
}));

jest.mock('../../js/utils/toastUtil', () => ({
	displayAssignSuccessToast: jest.fn(),
	displayDeleteSuccessToast: jest.fn(),
}));

function renderCalendarView() {
	return render(
		<CalendarView
			items={[]}
			itemsActions={[]}
			projectId="123"
			projectObjectDefinitionId={456}
		/>
	);
}

describe('CalendarView view switcher', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		(global as any).Liferay.FeatureFlags = {'LPD-69885': true};
		(global as any).Liferay.fire = jest.fn();
	});

	it('changes the calendar view when a switcher button is clicked', () => {
		renderCalendarView();

		fireEvent.click(screen.getByRole('button', {name: 'day'}));

		expect(mockChangeView).toHaveBeenCalledWith('dayGridDay');

		fireEvent.click(screen.getByRole('button', {name: 'week'}));

		expect(mockChangeView).toHaveBeenCalledWith('dayGridWeek');

		fireEvent.click(screen.getByRole('button', {name: 'month'}));

		expect(mockChangeView).toHaveBeenCalledWith('dayGridMonth');
	});

	it('marks the view reported by FullCalendar as pressed', () => {
		renderCalendarView();

		expect(screen.getByRole('button', {name: 'month'})).toHaveAttribute(
			'aria-pressed',
			'true'
		);
		expect(screen.getByRole('button', {name: 'week'})).toHaveAttribute(
			'aria-pressed',
			'false'
		);

		act(() => {
			mockFullCalendarProps.current.datesSet({
				view: {title: 'Jul 6 – 12, 2026', type: 'dayGridWeek'},
			});
		});

		expect(screen.getByRole('button', {name: 'week'})).toHaveAttribute(
			'aria-pressed',
			'true'
		);
		expect(screen.getByRole('button', {name: 'month'})).toHaveAttribute(
			'aria-pressed',
			'false'
		);
	});
});
