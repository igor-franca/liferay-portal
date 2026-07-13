/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';

import AIAssistantChat from '../../../src/main/resources/META-INF/resources/js/AIAssistantChat/AIAssistantChat';
import {createEventSource} from '../../../src/main/resources/META-INF/resources/js/AIAssistantChat/api';
import {createCategorizationEventSource} from '../../../src/main/resources/META-INF/resources/js/Categorization/api';
import {CATEGORIZE_EVENT} from '../../../src/main/resources/META-INF/resources/js/Categorization/events';
import {ECategorizationAgent} from '../../../src/main/resources/META-INF/resources/js/Categorization/types';
import {postAIIssueReport} from '../../../src/main/resources/META-INF/resources/js/ReportFeedback/api';

jest.mock(
	'../../../src/main/resources/META-INF/resources/js/AIAssistantChat/api',
	() => ({
		createEventSource: jest.fn(() => Promise.resolve(null)),
		postChatByExternalReferenceCodeMessage: jest.fn(() =>
			Promise.resolve()
		),
	})
);

jest.mock(
	'../../../src/main/resources/META-INF/resources/js/Categorization/api'
);

jest.mock(
	'../../../src/main/resources/META-INF/resources/js/ReportFeedback/api'
);

const mockCreateCategorizationEventSource =
	createCategorizationEventSource as jest.MockedFunction<
		typeof createCategorizationEventSource
	>;
const mockCreateEventSource = createEventSource as jest.MockedFunction<
	typeof createEventSource
>;
const mockPostAIIssueReport = postAIIssueReport as jest.MockedFunction<
	typeof postAIIssueReport
>;

const defaultProps = {
	getContext: () => ({}),
	instructionDefinitionScope: 'test-scope',
};

function createFakeEventSource() {
	const listeners: Record<string, (event: {data: string}) => void> = {};

	return {
		addEventListener: jest.fn(
			(type: string, handler: (event: {data: string}) => void) => {
				listeners[type] = handler;
			}
		),
		close: jest.fn(),
		emit(type: string, data: string) {
			listeners[type]?.({data});
		},
	};
}

async function renderAndOpen(
	props: Partial<React.ComponentProps<typeof AIAssistantChat>> = {}
) {
	await act(async () => {
		render(<AIAssistantChat {...defaultProps} {...props} />);
	});

	await act(async () => {
		screen
			.getByRole('button', {name: 'ai-assistant'})
			.dispatchEvent(new MouseEvent('click', {bubbles: true}));
	});
}

function fireCategorizeEvent(payload: unknown) {
	const handler = (Liferay.on as jest.Mock).mock.calls
		.filter(([eventName]) => eventName === CATEGORIZE_EVENT)
		.at(-1)?.[1];

	handler?.(payload);
}

function getSidebar() {
	return screen.getByRole('complementary', {name: 'ai-assistant'});
}

describe('AIAssistantChat', () => {
	beforeEach(() => {

		// Clay's SidePanel derives its mobile behavior (focus trap that
		// aria-hides the rest of the page) from the body width, which is
		// always 0 in jsdom; report a desktop width instead.

		Object.defineProperty(document.body, 'clientWidth', {
			configurable: true,
			value: 1440,
		});

		window.HTMLElement.prototype.scrollIntoView = jest.fn();
		window.localStorage.clear();

		mockCreateCategorizationEventSource.mockReset();
		mockCreateCategorizationEventSource.mockResolvedValue(null);
		mockCreateEventSource.mockReset();
		mockCreateEventSource.mockResolvedValue(null);
		mockPostAIIssueReport.mockReset();
		mockPostAIIssueReport.mockResolvedValue({id: 'report-1'});

		global.Liferay = {
			...global.Liferay,
			Util: {
				...global.Liferay?.Util,
				openToast: jest.fn(),
			},
		};
	});

	it('shows the chat input immediately on open', async () => {
		await renderAndOpen();

		expect(
			screen.getByPlaceholderText('Ask me anything...')
		).toBeInTheDocument();
	});

	it('shows the footer disclaimer', async () => {
		await renderAndOpen();

		expect(
			screen.getByText('ai-generated-responses-may-be-inaccurate')
		).toBeInTheDocument();
	});

	it('exposes the feedback row on a successful message and wires the codes', async () => {
		const fakeEventSource = createFakeEventSource();

		mockCreateEventSource.mockResolvedValue(fakeEventSource as never);

		await renderAndOpen();

		await act(async () => {
			fakeEventSource.emit(
				'Chat Message Sent',
				JSON.stringify({
					agentDefinitionExternalReferenceCodes: ['agent-x'],
					data: 'Here is your answer',
				})
			);
		});

		expect(
			screen.getByRole('button', {name: 'report-bad-result'})
		).toBeInTheDocument();

		await act(async () => {
			fireEvent.click(
				screen.getByRole('button', {name: 'good-response'})
			);
		});

		expect(mockPostAIIssueReport).toHaveBeenCalledWith({
			agentDefinitionExternalReferenceCodes: ['agent-x'],
			feedback: 'positive',
			surface: 'aiAssistant',
		});
	});

	it('hides the feedback row on an error message', async () => {
		const fakeEventSource = createFakeEventSource();

		mockCreateEventSource.mockResolvedValue(fakeEventSource as never);

		await renderAndOpen();

		await act(async () => {
			fakeEventSource.emit(
				'Agent Invocation Failed',
				JSON.stringify({data: 'Something went wrong'})
			);
		});

		expect(screen.getByText('Something went wrong')).toBeInTheDocument();
		expect(
			screen.queryByRole('button', {name: 'good-response'})
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole('button', {name: 'report-bad-result'})
		).not.toBeInTheDocument();
	});

	it('offers the maximize toggle in the default display mode', async () => {
		await renderAndOpen();

		expect(
			screen.getByRole('button', {name: 'maximize'})
		).toBeInTheDocument();
	});

	it('offers no maximize toggle in the dropdown display mode', async () => {
		await renderAndOpen({displayMode: 'dropdown'});

		expect(
			screen.getByPlaceholderText('Ask me anything...')
		).toBeInTheDocument();
		expect(
			screen.queryByRole('button', {name: 'maximize'})
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole('complementary', {name: 'ai-assistant'})
		).not.toBeInTheDocument();
	});

	it('opens the sidebar from the trigger in the sidebar display mode', async () => {
		await renderAndOpen({displayMode: 'sidebar'});

		expect(
			screen.getByRole('button', {name: 'ai-assistant'})
		).toHaveAttribute('aria-expanded', 'true');

		const sidebar = getSidebar();

		await waitFor(() => expect(sidebar).not.toHaveAttribute('inert'));

		expect(
			within(sidebar).getByPlaceholderText('Ask me anything...')
		).toBeInTheDocument();
		expect(
			screen.queryByRole('button', {name: 'minimize'})
		).not.toBeInTheDocument();
	});

	it('closes the sidebar on Escape', async () => {
		await renderAndOpen({displayMode: 'sidebar'});

		const sidebar = getSidebar();

		await waitFor(() => expect(sidebar).not.toHaveAttribute('inert'));

		await act(async () => {
			fireEvent.keyDown(document, {key: 'Escape'});
		});

		await waitFor(() => expect(sidebar).toHaveAttribute('inert'));

		expect(
			screen.getByRole('button', {name: 'ai-assistant'})
		).toHaveAttribute('aria-expanded', 'false');
	});

	it('moves the conversation into the sidebar when maximized', async () => {
		const fakeEventSource = createFakeEventSource();

		mockCreateEventSource.mockResolvedValue(fakeEventSource as never);

		await renderAndOpen();

		await act(async () => {
			fakeEventSource.emit(
				'Chat Message Sent',
				JSON.stringify({data: 'Here is your answer'})
			);
		});

		await act(async () => {
			fireEvent.click(screen.getByRole('button', {name: 'maximize'}));
		});

		expect(
			within(getSidebar()).getByText('Here is your answer')
		).toBeInTheDocument();

		await act(async () => {
			fireEvent.click(screen.getByRole('button', {name: 'minimize'}));
		});

		expect(
			screen.getByRole('button', {name: 'maximize'})
		).toBeInTheDocument();
		expect(screen.getByText('Here is your answer')).toBeInTheDocument();
	});

	it('keeps the live connection across shell switches', async () => {
		await renderAndOpen();

		await act(async () => {
			fireEvent.click(screen.getByRole('button', {name: 'maximize'}));
		});

		await act(async () => {
			fireEvent.click(screen.getByRole('button', {name: 'minimize'}));
		});

		expect(mockCreateEventSource).toHaveBeenCalledTimes(1);
	});

	it('keeps the message draft when switching shells', async () => {
		await renderAndOpen();

		fireEvent.change(screen.getByPlaceholderText('Ask me anything...'), {
			target: {value: 'Draft in progress'},
		});

		await act(async () => {
			fireEvent.click(screen.getByRole('button', {name: 'maximize'}));
		});

		expect(
			within(getSidebar()).getByPlaceholderText('Ask me anything...')
		).toHaveValue('Draft in progress');
	});

	it('persists the expanded choice and restores it on the next mount', async () => {
		await renderAndOpen();

		await act(async () => {
			fireEvent.click(screen.getByRole('button', {name: 'maximize'}));
		});

		expect(
			window.localStorage.getItem(
				'com.liferay.ai.hub.cell.assistant.expanded'
			)
		).toBe('true');

		cleanup();

		await renderAndOpen();

		const sidebar = getSidebar();

		await waitFor(() => expect(sidebar).not.toHaveAttribute('inert'));

		expect(
			screen.getByRole('button', {name: 'minimize'})
		).toBeInTheDocument();
	});

	it('opens the dropdown when a categorize event fires in the default display mode', async () => {
		await act(async () => {
			render(<AIAssistantChat {...defaultProps} />);
		});

		await act(async () => {
			fireCategorizeEvent({
				agent: ECategorizationAgent.GENERATE_TAGS,
				content: 'Body',
			});
		});

		expect(screen.getByText('generate-tags')).toBeInTheDocument();
		expect(
			screen.getByRole('button', {name: 'maximize'})
		).toBeInTheDocument();
	});

	it('opens the sidebar when a categorize event fires in the sidebar display mode', async () => {
		await act(async () => {
			render(<AIAssistantChat {...defaultProps} displayMode="sidebar" />);
		});

		await act(async () => {
			fireCategorizeEvent({
				agent: ECategorizationAgent.GENERATE_TAGS,
				content: 'Body',
			});
		});

		const sidebar = getSidebar();

		await waitFor(() => expect(sidebar).not.toHaveAttribute('inert'));

		expect(within(sidebar).getByText('generate-tags')).toBeInTheDocument();
	});

	it('reaches the report feedback modal in the embedded shell', async () => {
		const fakeEventSource = createFakeEventSource();

		mockCreateEventSource.mockResolvedValue(fakeEventSource as never);

		await act(async () => {
			render(<AIAssistantChat {...defaultProps} embedded />);
		});

		await act(async () => {
			fakeEventSource.emit(
				'Chat Message Sent',
				JSON.stringify({
					agentDefinitionExternalReferenceCodes: ['agent-x'],
					data: 'Here is your answer',
				})
			);
		});

		await act(async () => {
			fireEvent.click(
				screen.getByRole('button', {name: 'report-bad-result'})
			);
		});

		expect(
			await screen.findByText('incorrect-or-inaccurate-response')
		).toBeInTheDocument();
	});
});
