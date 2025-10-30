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

		const actionButton = new ButtonView();

		actionButton.set({
			label: 'Action',
			withText: true
		});

		actionButton.on('execute', () => {
			console.log('Action button clicked!');
		});

		const cancelButton = new ButtonView();

		cancelButton.set({
			label: 'Cancel',
			withText: true
		});

		cancelButton.on('execute', () => {
			console.log('Cancel button clicked!');
		});

		view.setTemplate({
			tag: 'div',
			attributes: {
				class: [ 'ck', 'ck-simple-balloon' ]
			},
			children: [
				{
					tag: 'p',
					children: [ 'This is a custom balloon!' ]
				},
				actionButton,
				cancelButton
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