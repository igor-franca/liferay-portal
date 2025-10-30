import {Plugin} from '@ckeditor/ckeditor5-core/dist/index.js';
import {
	ButtonView, ContextualBalloon, View
} from '@ckeditor/ckeditor5-ui/dist/index.js';

export class SimpleActionPlugin extends Plugin {
    static get requires() {
		return [ ContextualBalloon ];
	}

	init() {
		const editor = this.editor;
        this._balloon = editor.plugins.get(ContextualBalloon);
        this._view = this._createView();

		editor.ui.componentFactory.add('simpleAction', () => {
			const button = new ButtonView();

            button.set( {
				label: 'Show Balloon',
				withText: true
			});

			button.on('execute', () => {
				const selection = editor.model.document.selection;

                let text = '';

                for (const range of selection.getRanges()) {
                    for (const item of range.getItems()) {
                        if (item.is && item.is('model:$textProxy')) {
                            text += (item as any).data;
                        }
                    }
                }

				this._showBalloon();
			});

			return button;
		});
	}

	_createView() {
		const view = new View();

		const improveWrittingButton = new ButtonView();

		improveWrittingButton.set({
			label: 'Improve writting',
			withText: true
		});

		improveWrittingButton.on('execute', () => {
			const selection = this.editor.model.document.selection;

			let text = '';

			for (const range of selection.getRanges()) {
				for (const item of range.getItems()) {
					if (item.is && item.is('model:$textProxy')) {
						text += (item as any).data;
					}
				}
			}

			const editorContent = this.editor.getData();

			this.editor.setData(editorContent.replaceAll(text, 'Improve writting'));
		});

		const fixSpellingButton = new ButtonView();

		fixSpellingButton.set({
			label: 'Fix spelling & grammar',
			withText: true,
		});

		fixSpellingButton.on('execute', () => {
			const selection = this.editor.model.document.selection;

			let text = '';

			for (const range of selection.getRanges()) {
				for (const item of range.getItems()) {
					if (item.is && item.is('model:$textProxy')) {
						text += (item as any).data;
					}
				}
			}

			const editorContent = this.editor.getData();

			this.editor.setData(editorContent.replaceAll(text, 'Fix spelling & grammar'));
		});

		view.setTemplate({
			tag: 'div',
			attributes: {
				class: [ 'ck', 'ck-my-styled-balloon' ]
			},
			children: [
				improveWrittingButton,
				fixSpellingButton
			]
		});

		return view;
	}

    _getBalloonPositionData() {
		const view = this.editor.editing.view;
		const viewDocument = view.document;
		return {
			target: () => view.domConverter.viewRangeToDom(
				viewDocument.selection.getFirstRange()
			)
		};
	}

	_showBalloon() {
		this._balloon.add({
			view: this._view,
			position: this._getBalloonPositionData()
		} );
		this._view.element.focus();
	}
}