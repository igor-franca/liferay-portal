/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ModelWriter} from 'ckeditor5';

import WritingAssistant from '../../../ckeditor5/plugins/WritingAssistant/WritingAssistant';
import * as api from '../../../ckeditor5/plugins/WritingAssistant/api';

jest.mock('frontend-js-web', () => ({
	...(jest.requireActual('frontend-js-web') as object),
	fetch: jest.fn(() =>
		Promise.resolve({
			json: () => Promise.resolve({}),
		})
	),
}));

const createWritingAssistant = async ({
	selectedContent,
	writer,
}: {
	selectedContent: string;
	writer: Partial<ModelWriter>;
}) => {
	const editor: any = {
		commands: {
			add: jest.fn(),
		},
		conversion: {
			for: jest.fn(() => ({
				markerToHighlight: jest.fn(),
			})),
		},
		editing: {
			view: {
				document: {
					selection: {
						getFirstRange: jest.fn(() => ({
							start: {offset: 0, parent: {}},
						})),
					},
				},
				domConverter: {
					viewRangeToDom: jest.fn(() => ({
						getBoundingClientRect: () => ({
							height: 20,
							left: 0,
							top: 0,
							width: 100,
						}),
					})),
				},
				focus: jest.fn(),
				scrollToTheSelection: jest.fn(),
			},
		},
		execute: jest.fn(),
		model: {
			change: jest.fn((callback) => callback(writer)),
			document: {
				selection: {
					getFirstRange: jest.fn(() => ({
						getItems: jest.fn(() => [
							{
								data: selectedContent,
								is: (type: string) => type === '$text',
							},
						]),
						start: {offset: 0, parent: {}},
					})),
					on: jest.fn(),
				},
			},
		},
		on: jest.fn(),
		plugins: {
			get: jest.fn(() => {
				return {
					add: jest.fn(),
					init: jest.fn(),
					remove: jest.fn(),
				};
			}),
		},
	};

	const writingAssistant = new WritingAssistant(editor);

	await writingAssistant.init();

	return {editor, writingAssistant};
};

const getRegisteredListener = (
	editor: any,
	eventName: string
): (() => void) => {
	const calls = editor.model.document.selection.on.mock.calls;

	const listener = calls.find(([event]: any) => event === eventName)?.[1];

	if (!listener) {
		throw new Error(`No listener registered for "${eventName}"`);
	}

	return listener;
};

const triggerSelectionChange = (editor: any, debounceMs = 300) => {
	const selectionListener = getRegisteredListener(editor, 'change:range');

	selectionListener();
	jest.advanceTimersByTime(debounceMs);
};

describe('WritingAssistant', () => {
	let writer: any;

	beforeEach(async () => {
		jest.useFakeTimers();

		jest.spyOn(api, 'createEventSourceConnection').mockReturnValue({
			addEventListener: jest.fn(),
			close: jest.fn(),
		} as any);

		writer = {
			addMarker: jest.fn(),
			createPositionAt: jest.fn(),
			createRange: jest.fn(),
			insertText: jest.fn(),
			remove: jest.fn(),
			setSelection: jest.fn(),
		};
	});

	it('displays balloon when text is selected', async () => {
		const {editor, writingAssistant} = await createWritingAssistant({
			selectedContent: 'Some selected text',
			writer,
		});

		writingAssistant._showBalloon = jest.fn();
		triggerSelectionChange(editor);

		expect(writingAssistant._showBalloon).toHaveBeenCalled();
	});

	it('displays confirmation balloon after content update', async () => {
		const {writingAssistant} = await createWritingAssistant({
			selectedContent: 'Some selected text',
			writer,
		});

		writingAssistant._showConfimationBalloon = jest.fn();
		writingAssistant._changeContent('New content');

		expect(writingAssistant._showConfimationBalloon).toHaveBeenCalled();
	});

	it('registers writing assistant command on initialization', async () => {
		const {editor} = await createWritingAssistant({
			selectedContent: '',
			writer,
		});

		expect(editor.commands.add).toHaveBeenCalledWith(
			'writingAssistant',
			expect.any(Object)
		);
	});

	it('removes balloon when text selection is cleared', async () => {
		const {editor, writingAssistant} = await createWritingAssistant({
			selectedContent: '',
			writer,
		});

		writingAssistant._hideBalloon = jest.fn();
		triggerSelectionChange(editor);

		expect(writingAssistant._hideBalloon).toHaveBeenCalled();
	});

	it('updates content when receiving event source message', async () => {
		const eventSource = {
			addEventListener: jest.fn(),
		};

		jest.spyOn(api, 'createEventSourceConnection').mockReturnValue(
			eventSource as any
		);

		const {writingAssistant} = await createWritingAssistant({
			selectedContent: 'Some selected text',
			writer,
		});

		writingAssistant._changeContent = jest.fn();

		const messageHandler = eventSource.addEventListener.mock.calls[0][1];

		messageHandler({data: 'New content'});

		expect(writingAssistant._changeContent).toHaveBeenCalledWith(
			'New content'
		);
	});
});
