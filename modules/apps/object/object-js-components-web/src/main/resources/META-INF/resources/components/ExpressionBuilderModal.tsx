/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayModal, {useModal} from '@clayui/modal';
import {createResourceURL, fetch} from 'frontend-js-web';
import React, {useEffect, useRef, useState} from 'react';

import {REQUIRED_MSG} from '../utils/constants';
import CodeEditor, {SidebarCategory} from './CodeEditor/index';

type Callback = (source?: string) => void;

interface ExpressionBuilderModalProps {
	error?: string;
	eventSidebarElements?: SidebarCategory[];
	header?: string;
	onSave?: Callback;
	placeholder?: string;
	required?: boolean;
	sidebarElements: SidebarCategory[];
	source?: string;
	validateExpressionURL?: string;
}

export function ExpressionBuilderModal({
	error,
	eventSidebarElements,
	header,
	onSave,
	placeholder,
	required,
	sidebarElements,
	source,
}: ExpressionBuilderModalProps) {
	const editorRef = useRef<CodeMirror.Editor>(null);
	const [state, setState] = useState<{
		error?: string;
		eventSidebarElements?: SidebarCategory[];
		header?: string;
		onSave?: Callback;
		placeholder?: string;
		required?: boolean;
		source?: string;
		validateExpressionURL?: string;
	}>({
		error: error ?? '',
		eventSidebarElements: eventSidebarElements ?? [],
		header: header ?? '',
		onSave: onSave ?? (() => {}),
		placeholder: placeholder ?? '',
		required: required ?? false,
		source: source ?? '',
	});

	const {observer, onOpenChange} = useModal({
		onClose: () => setState({}),
	});

	useEffect(() => {
		const openModal = (params: {
			eventSidebarElements: SidebarCategory[];
			header: string;
			onSave: Callback;
			placeholder: string;
			required: boolean;
			source: string;
			validateExpressionURL: string;
		}) => {
			setState(params);
		};

		Liferay.on('openExpressionBuilderModal', openModal);

		return () =>
			Liferay.detach(
				'openExpressionBuilderModal',
				openModal as () => void
			);
	}, []);

	if (state.source === undefined) {
		return null;
	}

	const closeModal = () => {
		onOpenChange(false);
	};

	const handleSave = async () => {
		const source = editorRef.current?.getValue();

		let error: string | undefined;

		if (state.required && !source?.trim()) {
			error = REQUIRED_MSG;
		}
		else if (source?.trim() && state.validateExpressionURL) {
			const response = await fetch(
				createResourceURL(state.validateExpressionURL, {
					expression: source,
				}).href
			);

			const {valid}: {valid: boolean} = await response.json();

			if (!valid) {
				error = Liferay.Language.get('syntax-error');
			}
		}

		if (error) {
			setState((state) => ({
				...state,
				error,
			}));
		}
		else {
			state.onSave?.(source);
			closeModal();
		}
	};

	return (
		<ClayModal
			className="lfr-objects__expression-builder-modal"
			observer={observer}
			size="lg"
		>
			<ClayModal.Header>
				{state.header ?? Liferay.Language.get('expression-builder')}
			</ClayModal.Header>

			<ClayModal.Body>
				<CodeEditor
					error={state.error}
					onChange={() => {}}
					placeholder={
						state.placeholder ??
						`<#-- ${Liferay.Util.sub(
							Liferay.Language.get(
								'create-the-condition-of-the-action-using-the-expression-builder-type-x-to-use-the-autocomplete-feature'
							),
							['"${"']
						)} -->`
					}
					ref={editorRef}
					sidebarElements={
						state.eventSidebarElements || sidebarElements
					}
					value={state.source}
				/>
			</ClayModal.Body>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton
							displayType="secondary"
							onClick={closeModal}
						>
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
