/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Command, Editor, Plugin} from '@ckeditor/ckeditor5-core/dist/index.js';
import {EditingView, Model} from '@ckeditor/ckeditor5-engine/dist/index.js';
import {ContextualBalloon, View} from '@ckeditor/ckeditor5-ui/dist/index.js';
import {EventSource} from 'eventsource';
import {fetch} from 'frontend-js-web';
import React from 'react';
import {Root, createRoot} from 'react-dom/client';

import WriteAssistentActions from './components/WriteAssistentActions';
import WriteAssistentConfirmatinoAction from './components/WriteAssistentConfimationAction';

export default class WriteAssistent extends Plugin {
	private _balloonView: View | null = null;
	private _contentSelection = '';
	private _reactRoot: Root | null = null;

	static get requires() {
		return [ContextualBalloon];
	}
	async init() {
		const editor = this.editor;

		const balloon = editor.plugins.get(ContextualBalloon);
		const commandName = 'writeAssistent';

		editor.commands.add(commandName, new Command(editor));
		const model = editor.model;
		const view = editor.editing.view;

		editor.conversion.for('editingDowncast').markerToHighlight({
			model: 'aiHighlight',
			view: {
				classes: 'ai-highlight',
				priority: 10,
			},
		});

		this._onConnect();
		this._selectionChange2(balloon, editor, model);
	}

	_changeContent(content: string) {
		const editor = this.editor;
		
		const balloon = editor.plugins.get(ContextualBalloon);
		const model = editor.model;
		const view = editor.editing.view;

		const oldContent = this._contentSelection;

		model.change((writer: any) => {
			const selection = model.document.selection;

			const range = selection.getFirstRange();

			if (!range) {
				return;
			}

			writer.remove(range);

			const insertPosition = range.start;

			writer.insertText(content, insertPosition);

			const endPosition = writer.createPositionAt(
				insertPosition.parent,
				insertPosition.offset + content.length
			);

			const newRange = writer.createRange(insertPosition, endPosition);

			writer.setSelection(newRange);

			writer.addMarker('aiHighlight', {
				affectsData: false,
				range: newRange,
				usingOperation: false,
			});

			view.focus();

			view.scrollToTheSelection();

			this._hideBalloon(balloon);

			this._showConfimationBalloon(balloon, content, editor);
		});

		view.focus();
		view.scrollToTheSelection();
	}

	_getBalloonPosition(editor: any) {
		const view = editor.editing.view;

		const domConverter = view.domConverter;

		const domRange = domConverter.viewRangeToDom(
			view.document.selection.getFirstRange()
		);

		return {target: domRange};
	}

	_hideBalloon(balloon: ContextualBalloon) {
		if (this._balloonView && balloon.hasView(this._balloonView)) {
			balloon.remove(this._balloonView);
		}
	}

	_hideConfirmationBalloon (balloon: ContextualBalloon) {
		if (this._balloonView && balloon.hasView(this._balloonView)) {
			balloon.remove(this._balloonView);
		}
	}

	_onConnect() {
		const event = new EventSource('/o/ai-hub/v1.0/tasks/subscribe', {
			withCredentials: true,
			fetch: (input, init) =>
				fetch(input as RequestInfo, {
					...init,
					headers: new Headers({
						'Accept': 'text/event-stream',
						'x-csrf-token': Liferay.authToken,
					}),
				}),
		});

		event.addEventListener('Improve Writing', (event) => {
			this._changeContent(event.data);
		});
	}

	_removeMarker(model: Model) {
		model.change((writer: any) => {
			const marker = model.markers.get('aiHighlight');
			if (marker) {
				writer.removeMarker('aiHighlight');
			}
		});
	}

	_selectedContent(model: any) {
		const selection = model.document.selection;
		this._contentSelection = '';

		for (const range of selection.getRanges()) {
			for (const item of range.getItems()) {
				if (item.is && item.is('model:$textProxy')) {
					this._contentSelection += (item as any).data;
				}
			}
		}
	}

	// _selectionChange1(
	// 	balloon: ContextualBalloon,
	// 	editor: Editor,
	// 	model: Model,
	// 	view: EditingView
	// ) {
	// 	view.document.on('mouseup', () => {
	// 		this._selectedContent(model);

	// 		if (this._contentSelection.trim().length) {
	// 			this._showBalloon(balloon, editor);
	// 		}
	// 		else {
	// 			this._hideBalloon(balloon);
	// 		}
	// 	});
	// }

	_selectionChange2(
		balloon: ContextualBalloon,
		editor: Editor,
		model: Model,
	) {
		model.document.selection.on('change:range', () => {
			this._selectedContent(model);


			if (this._contentSelection.trim().length) {
				this._showBalloon(balloon, editor);
			}
			else {
				this._hideBalloon(balloon);
			}
		});
	}

	_showBalloon(balloon: ContextualBalloon, editor: any) {
		if (this._balloonView && balloon.hasView(this._balloonView)) {
			return;
		}

		const reactView = new View();

		reactView.setTemplate({
			attributes: {
				class: 'custom-react-balloon',
			},
			tag: 'div',
		});

		reactView.once('render', () => {
			if (!reactView.element) {
				return;
			}

			const root = createRoot(reactView.element);

			root.render(
				<WriteAssistentActions
					containerRef={reactView.element}
					content={this._contentSelection}
				/>
			);
			this._reactRoot = root;
		});

		this._balloonView = reactView;

		balloon.add({
			position: this._getBalloonPosition(editor),
			view: this._balloonView,
		});
	}

	_showConfimationBalloon(
		balloon: ContextualBalloon,
		content: string,
		editor: any,
	) {
		if (this._balloonView && balloon.hasView(this._balloonView)) {
			return;
		}

		const reactView = new View();

		reactView.setTemplate({
			attributes: {
				class: 'custom-react-balloon',
			},
			tag: 'div',
		});

		reactView.once('render', () => {
			if (!reactView.element) {return;}

			const root = createRoot(reactView.element);
			root.render(
				<WriteAssistentConfirmatinoAction
					containerRef={reactView.element}
					content={content}
					handleAccept={() => {
						this._removeMarker(editor.model);
						this._hideConfirmationBalloon(balloon);
					}} 
					handleDiscard={() => {
						this._removeMarker(editor.model);
						editor.execute('undo');
						this._hideBalloon(balloon);
					}} 
				/>
			)
			this._reactRoot = root;
		});

		this._balloonView = reactView;

		balloon.add({
			position: this._getBalloonPosition(editor),
			view: this._balloonView,
		});
	}
}
