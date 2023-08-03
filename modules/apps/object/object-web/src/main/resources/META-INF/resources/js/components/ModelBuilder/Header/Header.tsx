/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton, {ClayButtonWithIcon} from '@clayui/button';
import ClayIcon from '@clayui/icon';
import React from 'react';

import './Header.scss';

import {sub} from 'frontend-js-web';

import {useFolderContext} from '../ModelBuilderContext/objectFolderContext';

interface Header {
	hasDraftObjectDefinitions: boolean;
}

export default function ({hasDraftObjectDefinitions}: Header) {
	const [{selectedFolderERC}] = useFolderContext();

	return (
		<div className="lfr-objects__model-builder-header">
			<div className="lfr-objects__model-builder-header-container">
				<div className="lfr-objects__model-builder-header-erc">
					<div>
						<span className="lfr-objects__model-builder-header-erc-label">
							{Liferay.Language.get('erc')}:&nbsp;
						</span>

						<strong>{selectedFolderERC}</strong>
					</div>

					<span
						role="tooltip"
						title={sub(
							Liferay.Language.get(
								'unique-key-for-referencing-the-x'
							),
							Liferay.Language.get('object-folder')
						)}
					>
						<ClayIcon symbol="question-circle" />
					</span>

					{selectedFolderERC !== 'uncategorized' && (
						<ClayButtonWithIcon
							aria-label={sub(
								Liferay.Language.get('edit-x'),
								Liferay.Language.get('external-reference-code')
							)}
							displayType="unstyled"
							symbol="pencil"
						/>
					)}
				</div>

				<div className="lfr-objects__model-builder-header-buttons-container">
					<ClayButtonWithIcon
						aria-label={Liferay.Language.get('toggle-sidebars')}
						displayType="secondary"
						symbol="view"
						title={Liferay.Language.get('toggle-sidebars')}
					/>

					<ClayButton displayType="secondary">
						{sub(
							Liferay.Language.get('x-folder'),
							Liferay.Language.get('create-new')
						)}
					</ClayButton>

					<ClayButton displayType="secondary">
						{Liferay.Language.get('export')}
					</ClayButton>

					<ClayButton
						disabled={!hasDraftObjectDefinitions}
						displayType="primary"
					>
						{Liferay.Language.get('publish')}
					</ClayButton>
				</div>
			</div>
		</div>
	);
}
