/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';
import './NodeFooter.scss';
interface NodeFooterProps {
	handleSelectedNode: () => void;
	isLinkedNode: boolean;
	setShowAllFields: (value: boolean) => void;
	setShowModal: React.Dispatch<
		React.SetStateAction<Partial<ViewObjectDefinitionsModals>>
	>;
	showAllFields: boolean;
}
export default function NodeFooter({
	handleSelectedNode,
	isLinkedNode,
	setShowAllFields,
	setShowModal,
	showAllFields,
}: NodeFooterProps): JSX.Element;
export {};
