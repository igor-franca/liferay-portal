/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayButton from '@clayui/button';
import ClayModal, {useModal} from '@clayui/modal';
import {createResourceURL, fetch, sub} from 'frontend-js-web';
import React, {useRef, useState} from 'react';

import {REQUIRED_MSG} from '../../utils/constants';
import CodeEditor, {SidebarCategory} from '../CodeEditor/index';

interface ExpressionBuilderModalProps {
	error?: string;
	header?: string;
	onCloseModal: () => void;
	onSave: (source: string) => void;
	placeholder?: string;
	required?: boolean;
	sidebarElements: SidebarCategory[];
	source?: string;
	validateExpressionURL?: string;
}

export function ExpressionBuilderModal({
	error = '',
	header,
	onCloseModal,
	onSave,
	placeholder,
	required = false,
	sidebarElements,
	source,
	validateExpressionURL,
}: ExpressionBuilderModalProps) {
	const editorRef = useRef<CodeMirror.Editor>(null);
	const [expressionError, setExpressionError] = useState(error);

	const {observer, onClose} = useModal({
		onClose: () => onCloseModal(),
	});

	if (source === undefined) {
		return null;
	}

	const handleSave = async () => {
		const source = editorRef.current?.getValue();

		if (required && !source?.trim()) {
			setExpressionError(REQUIRED_MSG);
		}
		else if (source?.trim() && validateExpressionURL) {
			const response = await fetch(
				createResourceURL(validateExpressionURL, {
					expression: source,
				}).href
			);

			const {valid}: {valid: boolean} = await response.json();

			if (!valid) {
				setExpressionError(Liferay.Language.get('syntax-error'));
			}
		}
		else {
			onSave(source ?? '');
			onClose();
		}
	};

	return (
		<ClayModal
			className="lfr-objects__expression-builder-modal"
			observer={observer}
			size="lg"
		>
			<ClayModal.Header>
				{header ?? Liferay.Language.get('expression-builder')}
			</ClayModal.Header>

			<ClayModal.Body>
				<CodeEditor
					error={expressionError}
					onChange={() => {}}
					placeholder={
						placeholder ??
						`<#-- ${sub(
							Liferay.Language.get(
								'create-the-condition-of-the-action-using-the-expression-builder-type-x-to-use-the-autocomplete-feature'
							),
							['"${"']
						)} -->`
					}
					ref={editorRef}
					sidebarElements={sidebarElements}
					value={source}
				/>
			</ClayModal.Body>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton displayType="secondary" onClick={onClose}>
							{Liferay.Language.get('cancel')}
						</ClayButton>

						<ClayButton onClick={handleSave}>
							{Liferay.Language.get('done')}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</ClayModal>
	);
}
