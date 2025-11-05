/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {fireEvent, render} from '@testing-library/react';
import React from 'react';

import WritingAssistantConfirmationAction from '../../../ckeditor5/plugins/WritingAssistant/components/WritingAssistantConfimationAction';

describe('WritingAssistantConfirmationAction', () => {
	it('calls handleAccept when the "Accept" button is clicked', () => {
		const handleAccept = jest.fn();

		const {getByText} = render(
			<WritingAssistantConfirmationAction
				containerRef={document.createElement('div')}
				handleAccept={handleAccept}
				handleDiscard={() => {}}
			/>
		);

		fireEvent.click(getByText('accept'));

		expect(handleAccept).toHaveBeenCalled();
	});

	it('calls handleDiscard when the "Discard" button is clicked', () => {
		const handleDiscard = jest.fn();

		const {getByText} = render(
			<WritingAssistantConfirmationAction
				containerRef={document.createElement('div')}
				handleAccept={() => {}}
				handleDiscard={handleDiscard}
			/>
		);

		fireEvent.click(getByText('discard'));

		expect(handleDiscard).toHaveBeenCalled();
	});

	it('renders the confirmation actions', () => {
		const {getByText} = render(
			<WritingAssistantConfirmationAction
				containerRef={document.createElement('div')}
				handleAccept={() => {}}
				handleDiscard={() => {}}
			/>
		);

		expect(getByText('accept')).toBeTruthy();
		expect(getByText('discard')).toBeTruthy();
		expect(getByText('regenerate')).toBeTruthy();
	});
});
