/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import {Text} from '@clayui/core';
import ClayModal, {useModal} from '@clayui/modal';
import {sub} from 'frontend-js-web';
import React from 'react';

interface ModalImportWarningProps {
	handleImport: () => void;
	handleOnClose: (value: boolean) => void;
	importedEntity: string;
}

export function ModalImportWarning({
	handleImport,
	handleOnClose,
	importedEntity,
}: ModalImportWarningProps) {
	const {observer, onClose} = useModal({
		onClose: () => handleOnClose(false),
	});

	return (
		<ClayModal center observer={observer} status="warning">
			<ClayModal.Header>
				{sub(Liferay.Language.get('update-existing-x'), importedEntity)}
			</ClayModal.Header>

			<ClayModal.Body>
				<div className="text-secondary">
					<Text as="p" color="secondary">
						{sub(
							Liferay.Language.get(
								'there-is-another-x-with-the-same-external-reference-code-as-the-imported-one'
							),
							importedEntity.toLowerCase()
						)}
					</Text>

					<Text as="p" color="secondary">
						{sub(
							Liferay.Language.get(
								'before-importing-the-new-x-you-may-want-to-back-up-its-entries-to-prevent-data-loss'
							),
							importedEntity.toLowerCase()
						)}
					</Text>

					<Text as="p" color="secondary">
						{Liferay.Language.get(
							'do-you-want-to-proceed-with-the-import-process'
						)}
					</Text>
				</div>
			</ClayModal.Body>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton
							displayType="secondary"
							onClick={() => onClose()}
						>
							{Liferay.Language.get('cancel')}
						</ClayButton>

						<ClayButton
							displayType="warning"
							onClick={() => {
								handleImport();
								onClose();
							}}
							type="button"
						>
							{Liferay.Language.get('continue')}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</ClayModal>
	);
}
