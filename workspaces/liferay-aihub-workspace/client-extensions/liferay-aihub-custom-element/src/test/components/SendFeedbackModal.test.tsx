/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import React from 'react';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {postAIIssueReport} from '../../api';
import SendFeedbackModal from '../../components/SendFeedbackModal';

vi.mock('../../api', () => ({postAIIssueReport: vi.fn()}));

// ClayModal defers rendering its children until a CSS transition completes,
// which never fires under jsdom. The modal's open/close animation is Clay's
// concern; here we mock it to a passthrough so the real form behavior renders
// synchronously and can be exercised.
vi.mock('@clayui/modal', () => {
	const ClayModal = ({children}: {children: React.ReactNode}) => (
		<div>{children}</div>
	);

	ClayModal.Header = ({children}: {children: React.ReactNode}) => (
		<div>{children}</div>
	);
	ClayModal.Body = ({children}: {children: React.ReactNode}) => (
		<div>{children}</div>
	);
	ClayModal.Footer = ({
		first,
		last,
	}: {
		first: React.ReactNode;
		last: React.ReactNode;
	}) => (
		<div>
			{first}
			{last}
		</div>
	);

	return {
		__esModule: true,
		default: ClayModal,
		useModal: () => ({observer: {}, onClose: vi.fn()}),
	};
});

const mockedPost = vi.mocked(postAIIssueReport);

function renderModal(
	overrides: Partial<{onClose: () => void; onSubmitted: () => void}> = {}
) {
	const props = {
		agentDefinitionExternalReferenceCodes: ['agent-1'],
		chatbotExternalReferenceCode: 'chatbot-1',
		onClose: vi.fn(),
		onSubmitted: vi.fn(),
		...overrides,
	};

	render(<SendFeedbackModal {...props} />);

	return props;
}

function selectReason(value: string) {
	fireEvent.change(screen.getByLabelText('Reason'), {target: {value}});
}

function submitForm() {
	fireEvent.submit(document.getElementById('aihub-feedback-form')!);
}

describe('SendFeedbackModal', () => {
	beforeEach(() => {
		mockedPost.mockReset();
	});

	it('renders the title and every reason option', () => {
		renderModal();

		expect(screen.getByText('Send Feedback')).toBeInTheDocument();
		expect(
			screen.getByText('Incorrect or Inaccurate Response')
		).toBeInTheDocument();
		expect(
			screen.getByText('Exposure of Personal or Sensitive Data (PII)')
		).toBeInTheDocument();
		expect(
			screen.getByText('Agent Error or Malfunction')
		).toBeInTheDocument();
	});

	it('keeps Send disabled until a reason is chosen', () => {
		renderModal();

		const send = screen.getByRole('button', {name: 'Send'});

		expect(send).toBeDisabled();

		selectReason('other');

		expect(send).toBeEnabled();
	});

	it('submits and calls onSubmitted on success', async () => {
		mockedPost.mockResolvedValue({id: 'mock-1'});

		const {onSubmitted} = renderModal();

		selectReason('incorrect');
		submitForm();

		await waitFor(() => expect(onSubmitted).toHaveBeenCalledTimes(1));

		expect(mockedPost).toHaveBeenCalledWith(
			expect.objectContaining({
				reason: 'incorrect',
				surface: 'clickToChat',
			})
		);
	});

	it('shows an inline error and keeps the modal open on failure', async () => {
		mockedPost.mockRejectedValue(new Error('nope'));

		const {onSubmitted} = renderModal();

		selectReason('other');
		submitForm();

		await waitFor(() =>
			expect(screen.getByText('nope')).toBeInTheDocument()
		);

		expect(onSubmitted).not.toHaveBeenCalled();
	});
});
