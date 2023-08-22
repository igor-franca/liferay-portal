/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';
import './Header.scss';
import {ViewObjectDefinitionsModals} from '../../ViewObjectDefinitions/ViewObjectDefinitions';
interface Header {
	folderExternalReferenceCode: string;
	folderName: string;
	hasDraftObjectDefinitions: boolean;
	setShowModal: (
		value: React.SetStateAction<ViewObjectDefinitionsModals>
	) => void;
}
export default function ({
	folderExternalReferenceCode,
	folderName,
	hasDraftObjectDefinitions,
	setShowModal,
}: Header): JSX.Element;
export {};
