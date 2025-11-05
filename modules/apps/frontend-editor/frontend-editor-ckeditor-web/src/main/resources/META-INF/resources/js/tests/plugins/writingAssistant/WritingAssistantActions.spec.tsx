/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {fireEvent, render} from '@testing-library/react';
import React from 'react';

import WritingAssistantActions from '../../../ckeditor5/plugins/WritingAssistant/components/WritingAssistantActions';

describe('WritingAssistantActions', () => {
	it('calls handleActionClick when an action is clicked', () => {
		const handleActionClick = jest.fn();

		const {getByText} = render(
			<WritingAssistantActions
				containerRef={document.createElement('div')}
				handleActionClick={handleActionClick}
			/>
		);

		fireEvent.click(getByText('improve-writing'));

		expect(handleActionClick).toHaveBeenCalledWith('Improve Writing');
	});

	it('renders the actions', () => {
		const {getByText} = render(
			<WritingAssistantActions
				containerRef={document.createElement('div')}
				handleActionClick={() => Promise.resolve()}
			/>
		);

		expect(getByText('improve-writing')).toBeTruthy();
		expect(getByText('fix-spelling-and-grammar')).toBeTruthy();
		expect(getByText('translate-to')).toBeTruthy();
		expect(getByText('make-shorter')).toBeTruthy();
		expect(getByText('make-longer')).toBeTruthy();
		expect(getByText('change-tone')).toBeTruthy();
		expect(getByText('generate-based-on')).toBeTruthy();
	});
});
