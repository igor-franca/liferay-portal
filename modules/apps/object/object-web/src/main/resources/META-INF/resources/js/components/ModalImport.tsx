/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayAlert from '@clayui/alert';
import ClayButton from '@clayui/button';
import ClayForm, {ClayInput} from '@clayui/form';
import ClayModal, {useModal} from '@clayui/modal';
import {API, Input} from '@liferay/object-js-components-web';
import {fetch} from 'frontend-js-web';
import React, {FormEvent, useEffect, useRef, useState} from 'react';

import {FormDataJSONFormat, jsonToFormData} from '../utils/formData';
import {ModalImportWarning} from './ModalImportWarning';
interface ModalImportProps {
	apiURL: string;
	externalReferenceCodeFeedbackMessage: string;
	handleOnClose?: () => void;
	importExtendedInfo?: {
		key: string;
		value: string;
	};
	importURL: string;
	JSONInputId: string;
	nameMaxLength: string;
	portletNamespace: string;
	showModal?: boolean;
	title: string;
	warningModalText: {
		body: string[];
		header: string;
	};
}

type TFile = {
	fileName?: string;
	inputFile?: File | null;
};

export default function ModalImport({
	apiURL,
	externalReferenceCodeFeedbackMessage,
	handleOnClose,
	importExtendedInfo,
	importURL,
	JSONInputId,
	nameMaxLength,
	portletNamespace,
	showModal,
	title,
	warningModalText,
}: ModalImportProps) {
	const [error, setError] = useState<string>('');
	const [externalReferenceCode, setExternalReferenceCode] = useState<string>(
		''
	);
	const [importFormData, setImportFormData] = useState<FormData>();
	const [visible, setVisible] = useState(showModal ?? false);
	const [warningModalVisible, setWarningModalVisible] = useState(false);
	const inputFileRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const [name, setName] = useState('');
	const importModalComponentId = `${portletNamespace}importModal`;
	const importFormId = `${portletNamespace}importForm`;
	const nameInputId = `${portletNamespace}name`;
	const [{fileName, inputFile}, setFile] = useState<TFile>({});

	const {observer, onClose} = useModal({
		onClose: () => {
			setVisible(false);
			setError('');
			setExternalReferenceCode('');
			setFile({
				fileName: '',
				inputFile: null,
			});
			setName('');
			setImportFormData(undefined);

			if (handleOnClose) {
				handleOnClose();
			}
		},
	});

	const handleImport = async (formData: FormData) => {
		try {
			await API.save({
				item: formData,
				method: 'POST',
				url: importURL,
			});

			window.location.reload();
		}
		catch (error) {
			setError((error as Error).message);
		}
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const formDataObject: FormDataJSONFormat = {};
		formData.forEach((value, key) => {
			if (key.includes('objectDefinitionJSON')) {
				formDataObject[key] = inputFile as File;

				return;
			}

			if (key.includes('objectFolderJSON')) {
				formDataObject[key] = inputFile as File;

				return;
			}

			formDataObject[key] = value;

			return;
		});

		if (Liferay.FeatureFlags['LPS-148856'] && importExtendedInfo) {
			formDataObject[importExtendedInfo.key] = importExtendedInfo.value;
		}

		const newFormData = jsonToFormData(formDataObject);

		const response = await fetch(`${apiURL}${externalReferenceCode}`);

		if (response.status === 204) {
			handleImport(newFormData);
		}
		else {
			setImportFormData(newFormData);
			setVisible(false);
			setWarningModalVisible(true);
		}
	};

	useEffect(() => {
		Liferay.component(
			importModalComponentId,
			{
				open: () => {
					setVisible(true);
				},
			},
			{
				destroyOnNavigate: true,
			}
		);

		return () =>
			Liferay.destroyComponent(importModalComponentId);
	}, [importModalComponentId, setVisible]);

	return visible ? (
		<ClayModal center observer={observer}>
			<ClayModal.Header>{title}</ClayModal.Header>

			<ClayModal.Body>
				<ClayForm id={importFormId} onSubmit={handleSubmit}>
					{error && (
						<ClayAlert displayType="danger">{error}</ClayAlert>
					)}

					<ClayAlert
						displayType="info"
						title={`${Liferay.Language.get('info')}:`}
					>
						{Liferay.Language.get(
							'the-import-process-will-run-in-the-background-and-may-take-a-few-minutes'
						)}
					</ClayAlert>

					<ClayForm.Group>
						<label htmlFor={nameInputId}>
							{Liferay.Language.get('name')}
						</label>

						<ClayInput
							id={nameInputId}
							maxLength={Number(nameMaxLength)}
							name={nameInputId}
							onChange={(event) => setName(event.target.value)}
							type="text"
							value={name}
						/>
					</ClayForm.Group>

					<ClayForm.Group>
						<label htmlFor={JSONInputId}>
							{Liferay.Language.get('json-file')}
						</label>

						<ClayInput.Group>
							<ClayInput.GroupItem prepend>
								<ClayInput
									disabled
									id={JSONInputId}
									type="text"
									value={fileName}
								/>
							</ClayInput.GroupItem>

							<ClayInput.GroupItem append shrink>
								<ClayButton
									displayType="secondary"
									onClick={() => inputFileRef.current.click()}
								>
									{Liferay.Language.get('select')}
								</ClayButton>
							</ClayInput.GroupItem>

							{inputFile && (
								<ClayInput.GroupItem shrink>
									<ClayButton
										displayType="secondary"
										onClick={() => {
											setExternalReferenceCode('');
											setFile({
												fileName: '',
												inputFile: null,
											});
										}}
									>
										{Liferay.Language.get('clear')}
									</ClayButton>
								</ClayInput.GroupItem>
							)}
						</ClayInput.Group>
					</ClayForm.Group>

					{externalReferenceCode && (
						<Input
							disabled
							feedbackMessage={
								externalReferenceCodeFeedbackMessage
							}
							id="externalReferenceCode"
							label={Liferay.Language.get(
								'external-reference-code'
							)}
							name="externalReferenceCode"
							value={externalReferenceCode}
						/>
					)}

					<input
						className="d-none"
						name={JSONInputId}
						onChange={({target}) => {
							const inputFile = target.files?.item(0);

							if (inputFile) {
								setFile({
									fileName: inputFile?.name,
									inputFile,
								});

								const fileReader = new FileReader();

								fileReader.readAsText(inputFile);

								fileReader.onload = () => {
									try {
										const JSONFile = JSON.parse(
											fileReader.result as string
										) as {externalReferenceCode: string};
										setError('');
										setExternalReferenceCode(
											JSONFile.externalReferenceCode
										);
									}
									catch (error) {
										setError(
											Liferay.Language.get(
												'the-structure-failed-to-import'
											)
										);
										setExternalReferenceCode('');
										setFile({
											fileName: '',
											inputFile: null,
										});
									}
								};
							}
						}}
						ref={inputFileRef}
						type="file"
					/>
				</ClayForm>
			</ClayModal.Body>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton displayType="secondary" onClick={onClose}>
							{Liferay.Language.get('cancel')}
						</ClayButton>

						<ClayButton
							disabled={!inputFile || !name}
							form={importFormId}
							type="submit"
						>
							{Liferay.Language.get('import')}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</ClayModal>
	) : warningModalVisible ? (
		<ModalImportWarning
			handleImport={() => handleImport(importFormData as FormData)}
			header={warningModalText.header}
			paragraphs={warningModalText.body}
			setVisibility={() => {
				setWarningModalVisible(false);
				setImportFormData(undefined);
			}}
		/>
	) : null;
}
