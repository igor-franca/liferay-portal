/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/// <reference types="react" />

interface ModalImportProps {
	JSONInputId: string;
	apiURL: string;
	handleOnClose?: () => void;
	importExtendedInfo?: {
		key: string;
		value: string;
	};
	importURL: string;
	importedEntity: string;
	nameMaxLength: string;
	portletNamespace: string;
	showModal?: boolean;
	title: string;
}
export default function ModalImport({
	JSONInputId,
	apiURL,
	handleOnClose,
	importExtendedInfo,
	importURL,
	importedEntity,
	nameMaxLength,
	portletNamespace,
	showModal,
	title,
}: ModalImportProps): JSX.Element | null;
export {};
