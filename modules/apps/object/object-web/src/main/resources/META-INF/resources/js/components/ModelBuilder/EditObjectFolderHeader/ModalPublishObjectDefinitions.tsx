/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import {Text} from '@clayui/core';
import {ClayCheckbox} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayList from '@clayui/list';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import ClayModal from '@clayui/modal';
import {Observer} from '@clayui/modal/lib/types';
import {API, getLocalizableLabel} from '@liferay/object-js-components-web';
import {sub} from 'frontend-js-web';
import React, {useEffect, useMemo, useState} from 'react';
import {Elements, FlowElement, isNode} from 'react-flow-renderer';

import {defaultLanguageId} from '../../../utils/constants';
import {TYPES} from '../ModelBuilderContext/typesEnum';
import {ObjectRelationshipEdgeData, TAction} from '../types';

import './ModalPublishObjectDefinitions.scss';

enum STATUS {
	APPROVED = 0,
	DRAFT = 2,
	PENDING = 1,
	REJECTED = -1,
}

interface ObjectDefinitionStatus {
	code: number;
	label?: string;
	label_i18n?: string;
}

interface ModalPublishObjectDefinitionsProps {
	disableAutoClose: boolean;
	dispatch: React.Dispatch<TAction>;
	elements: Elements<ObjectDefinitionNodeData | ObjectRelationshipEdgeData>;
	observer: Observer;
	onClose: () => void;
}

interface SelectedUnpublishedObjectDefinitions {
	errorMessage?: string;
	id: number;
	status: ObjectDefinitionStatus;
}

type TStatus = 'danger' | 'info' | 'success' | 'warning';

export function ModalPublishObjectDefinitions({
	disableAutoClose,
	dispatch,
	elements,
	observer,
	onClose,
}: ModalPublishObjectDefinitionsProps) {
	const [messageHeaderModal, setMessageHeaderModal] = useState<string>(
		Liferay.Language.get('confirm-publishing')
	);
	const [
		publishObjectDefinitionStatus,
		setPublishObjectDefinitionStatus,
	] = useState<number>(STATUS.DRAFT);
	const [
		selectAllObjectDefinitions,
		setSelectAllObjectDefinitions,
	] = useState<boolean>(false);
	const [
		selectedUnpublishedObjectDefinitions,
		setSelectedUnpublishedObjectDefinitions,
	] = useState<SelectedUnpublishedObjectDefinitions[]>([]);

	const objectDefinitionNodes = elements.filter((element) =>
		isNode(element)
	) as Elements<ObjectDefinitionNodeData>;

	const unpublishedObjectDefinitions = useMemo(() => {
		return objectDefinitionNodes.filter(
			(element) =>
				isNode(element) && element.data?.status?.code === STATUS.DRAFT
		);
	}, [objectDefinitionNodes]);

	const updateObjectDefinitionStatus = (
		objectDefinitionId: number,
		objectDefinitionStatus: ObjectDefinitionStatus,
		selectedUnpublishedObjectDefinitionsPrevState: SelectedUnpublishedObjectDefinitions[],
		errorMessage?: string
	) => {
		return selectedUnpublishedObjectDefinitionsPrevState.map(
			(selectedUnpublishedObjectDefinitionPrevState) => {
				if (
					selectedUnpublishedObjectDefinitionPrevState.id ===
					objectDefinitionId
				) {
					return {
						objectDefinitionId,
						objectDefinitionStatus,
						...(objectDefinitionStatus.code === STATUS.REJECTED && {
							errorMessage,
						}),
					};
				}
				else {
					return selectedUnpublishedObjectDefinitionPrevState;
				}
			}
		) as SelectedUnpublishedObjectDefinitions[];
	};

	const publishObjectDefinition = (
		objectDefinitionId: number
	): Promise<ObjectDefinition | number> => {
		// eslint-disable-next-line no-async-promise-executor
		return new Promise<ObjectDefinition | number>(async (resolve) => {
			try {
				const objectDefinitionResponse = await API.postObjectDefinitionPublish(
					objectDefinitionId
				);

				const objectDefinitionResponseJSON = await objectDefinitionResponse.json();

				if (!objectDefinitionResponse.ok) {
					throw new Error(objectDefinitionResponseJSON.title);
				}

				setSelectedUnpublishedObjectDefinitions((prevState) =>
					updateObjectDefinitionStatus(
						objectDefinitionId,
						objectDefinitionResponseJSON.status,
						prevState
					)
				);

				resolve(objectDefinitionResponseJSON);
			}
			catch (error: any) {
				setSelectedUnpublishedObjectDefinitions((prevState) =>
					updateObjectDefinitionStatus(
						objectDefinitionId,
						{code: STATUS.REJECTED},
						prevState,
						error.message
					)
				);

				// don't throw reject, so that it doesn't go to the catch flow of the promise.all

				resolve(STATUS.REJECTED);
			}
		});
	};

	const handleOnClickPublish = async () => {
		setMessageHeaderModal(`${Liferay.Language.get('publishing')}...`);
		setPublishObjectDefinitionStatus(STATUS.PENDING);

		const publishPromises = selectedUnpublishedObjectDefinitions.map(
			({id, status}) => {
				setSelectedUnpublishedObjectDefinitions((prevState) =>
					updateObjectDefinitionStatus(id, status, prevState)
				);

				return publishObjectDefinition(id);
			}
		);

		try {
			const responses = await Promise.all(publishPromises);

			const hasErrorsResponse = responses.some(
				(response) =>
					typeof response === 'number' && response === STATUS.REJECTED
			);
			const filteredResponses = responses.filter(
				(response) => typeof response === 'object'
			);

			setMessageHeaderModal(
				!hasErrorsResponse
					? Liferay.Language.get('successfully-published')
					: Liferay.Language.get('published-with-errors')
			);
			setPublishObjectDefinitionStatus(
				!hasErrorsResponse ? STATUS.APPROVED : STATUS.REJECTED
			);

			const newElements = elements.map((element) => {
				if (isNode(element)) {
					const elementId =
						(element as FlowElement<ObjectDefinitionNodeData>).data
							?.id || 0;

					const response = (filteredResponses as ObjectDefinition[]).find(
						(response) => response.id === elementId
					);

					if (response) {
						return {
							...element,
							data: {
								...element.data,
								status: response.status,
							},
						};
					}

					return element;
				}

				return element;
			});

			dispatch({
				payload: {
					newElements,
				},
				type: TYPES.SET_ELEMENTS,
			});
		}
		catch (error) {
			setMessageHeaderModal(Liferay.Language.get('confirm-publishing'));
			setPublishObjectDefinitionStatus(STATUS.REJECTED);
		}
	};

	const handleSelectAll = (
		actionType?: 'check-all' | 'check-remove-all'
	): void => {
		if (actionType) {
			const selectedAllUnpublishedObjectDefinitions =
				selectedUnpublishedObjectDefinitions.length ===
				unpublishedObjectDefinitions.length;

			if (
				selectedAllUnpublishedObjectDefinitions &&
				actionType !== 'check-all'
			) {
				setSelectAllObjectDefinitions(false);
				setSelectedUnpublishedObjectDefinitions([]);
			}
			else {
				const newUnpublishedObjectDefinitions = unpublishedObjectDefinitions.map(
					(unpublishedObjectDefinition) => {
						const {data} = unpublishedObjectDefinition;

						return {id: data?.id!, status: data?.status!};
					}
				);

				setSelectAllObjectDefinitions(true);
				setSelectedUnpublishedObjectDefinitions(
					newUnpublishedObjectDefinitions
				);
			}
		}
	};

	const handleCheckboxChange = ({
		objectDefinitionId,
	}: {
		objectDefinitionId: number;
	}): void => {
		if (
			selectedUnpublishedObjectDefinitions.some(
				(selectedUnpublishedObjectDefinition) =>
					selectedUnpublishedObjectDefinition.id ===
					objectDefinitionId
			)
		) {
			setSelectedUnpublishedObjectDefinitions(
				selectedUnpublishedObjectDefinitions.filter(
					(selectedUnpublishedObjectDefinition) =>
						selectedUnpublishedObjectDefinition.id !==
						objectDefinitionId
				)
			);
		}
		else {
			const objectDefinitionNode = objectDefinitionNodes.find(
				(currentObjectDefinitionNode) =>
					currentObjectDefinitionNode.data?.id === objectDefinitionId
			)!;

			setSelectedUnpublishedObjectDefinitions([
				...selectedUnpublishedObjectDefinitions,
				{
					id: objectDefinitionId,
					status: objectDefinitionNode.data?.status!,
				},
			]);
		}
	};

	const renderStatusModal = (): TStatus => {
		switch (publishObjectDefinitionStatus) {
			case STATUS.APPROVED:
				return 'success';
			case STATUS.PENDING:
				return 'info';
			case STATUS.REJECTED:
				return 'warning';
			default:
				return 'warning';
		}
	};

	useEffect(
		() =>
			setSelectAllObjectDefinitions(
				!!selectedUnpublishedObjectDefinitions.length
			),
		[selectedUnpublishedObjectDefinitions]
	);

	return (
		<ClayModal
			className="lfr-object__object-view-modal-object-definitions"
			disableAutoClose={disableAutoClose}
			observer={observer}
			status={renderStatusModal()}
		>
			<ClayModal.Header>{messageHeaderModal}</ClayModal.Header>

			<ClayModal.Body>
				<div className="c-mb-sm-4">
					<Text size={3}>
						{`${Liferay.Language.get(
							'publishing-all-draft-objects-at-once-can-make-them-available-for-creating-entries'
						)} ${Liferay.Language.get(
							'please-check-before-confirming'
						)}`}
					</Text>
				</div>

				{publishObjectDefinitionStatus === STATUS.DRAFT && (
					<div
						className={`lfr-object__object-view-modal-object-definitions-select-all-checkbox c-px-sm-3 c-mb-sm-2 ${
							selectAllObjectDefinitions ? 'active' : ''
						}`}
					>
						<ClayCheckbox
							checked={selectAllObjectDefinitions}
							indeterminate={
								selectAllObjectDefinitions &&
								selectedUnpublishedObjectDefinitions.length !==
									unpublishedObjectDefinitions.length
							}
							label={`${sub(
								Liferay.Language.get('x-of-x-items-selected'),
								selectedUnpublishedObjectDefinitions.length,
								unpublishedObjectDefinitions.length
							)}`}
							onChange={() => handleSelectAll('check-remove-all')}
						/>

						<ClayButton
							className="c-px-sm-0 text-3 text-weight-semi-bold"
							displayType="link"
							onClick={() => handleSelectAll('check-all')}
						>
							{Liferay.Language.get('select-all')}
						</ClayButton>
					</div>
				)}

				<ClayList className="container-list">
					{unpublishedObjectDefinitions.map(
						(unpublishedObjectDefinition) => {
							const {data, id} = unpublishedObjectDefinition;

							const selectedUnpublishedObjectDefinition = selectedUnpublishedObjectDefinitions.find(
								(unpublishedObjectDefinition) =>
									unpublishedObjectDefinition.id === data?.id!
							);

							const isSelectedUnpublishedObjectDefinition =
								selectedUnpublishedObjectDefinition?.id ===
								data?.id!;

							return (
								<ClayList.Item
									className={`lfr-object__object-view-modal-object-definitions-list-item ${
										isSelectedUnpublishedObjectDefinition
											? 'active'
											: ''
									}`}
									key={id}
								>
									<div>
										{publishObjectDefinitionStatus ===
											STATUS.DRAFT && (
											<ClayCheckbox
												checked={
													isSelectedUnpublishedObjectDefinition
												}
												disabled={
													selectedUnpublishedObjectDefinition?.status !==
														undefined &&
													[
														STATUS.APPROVED,
														STATUS.PENDING,
													].includes(
														selectedUnpublishedObjectDefinition
															?.status?.code
													)
												}
												onChange={() =>
													handleCheckboxChange({
														objectDefinitionId: data?.id!,
													})
												}
											/>
										)}

										<ClayIcon symbol="catalog" />

										<div>
											<div>
												<Text
													size={3}
													weight="semi-bold"
												>
													{getLocalizableLabel(
														defaultLanguageId,
														data?.label,
														data?.name
													)}
												</Text>
											</div>

											{selectedUnpublishedObjectDefinition
												?.status?.code ===
												STATUS.REJECTED && (
												<span className="rejected text-danger">
													<ClayIcon
														color="danger"
														symbol="exclamation-full"
													/>

													<Text size={2}>
														{
															selectedUnpublishedObjectDefinition?.errorMessage
														}
													</Text>
												</span>
											)}
										</div>
									</div>

									<div>
										{selectedUnpublishedObjectDefinition
											?.status?.code ===
											STATUS.PENDING && (
											<ClayLoadingIndicator
												displayType="secondary"
												size="sm"
											/>
										)}

										{selectedUnpublishedObjectDefinition
											?.status?.code ===
											STATUS.APPROVED && (
											<Text color="success">
												<ClayIcon symbol="check" />
											</Text>
										)}
									</div>
								</ClayList.Item>
							);
						}
					)}
				</ClayList>
			</ClayModal.Body>

			<ClayModal.Footer
				last={
					publishObjectDefinitionStatus === STATUS.APPROVED ||
					publishObjectDefinitionStatus === STATUS.REJECTED ? (
						<ClayButton.Group key={1} spaced>
							<ClayButton displayType="primary" onClick={onClose}>
								{Liferay.Language.get('close')}
							</ClayButton>
						</ClayButton.Group>
					) : (
						<ClayButton.Group key={2} spaced>
							<>
								<ClayButton
									className="c-mr-sm-2"
									displayType="secondary"
									onClick={onClose}
								>
									{Liferay.Language.get('cancel')}
								</ClayButton>

								<ClayButton
									disabled={
										!selectedUnpublishedObjectDefinitions.length ||
										publishObjectDefinitionStatus ===
											STATUS.PENDING
									}
									displayType="primary"
									onClick={handleOnClickPublish}
								>
									{publishObjectDefinitionStatus ===
									STATUS.PENDING
										? Liferay.Language.get('please-wait') +
										  '...'
										: Liferay.Language.get(
												'publish-objects'
										  )}
								</ClayButton>
							</>
						</ClayButton.Group>
					)
				}
			></ClayModal.Footer>
		</ClayModal>
	);
}
