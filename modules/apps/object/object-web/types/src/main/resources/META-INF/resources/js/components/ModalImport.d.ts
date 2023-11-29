/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/// <reference types="react" />

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
export default function ModalImport({
	JSONInputId,
	apiURL,
	externalReferenceCodeFeedbackMessage,
	handleOnClose,
	importExtendedInfo,
	importURL,
	nameMaxLength,
	portletNamespace,
	showModal,
	title,
	warningModalText,
}: ModalImportProps): JSX.Element | null;
export {};
