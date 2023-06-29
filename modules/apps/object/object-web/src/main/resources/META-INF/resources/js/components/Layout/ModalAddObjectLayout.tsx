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

import {ClayModalProvider, useModal} from '@clayui/modal';
import React from 'react';

import ModalBasicWithFieldName from '../ModalBasicWithFieldName';

interface ModalAddObjectLayoutProps {
	apiURL: string;
	onVisibilityChange: (value: boolean) => void;
}

export function ModalAddObjectLayout({
	apiURL,
	onVisibilityChange,
}: ModalAddObjectLayoutProps) {
	const {observer, onClose} = useModal({
		onClose: () => onVisibilityChange(false),
	});

	return (
		<ClayModalProvider>
			<ModalBasicWithFieldName
				apiURL={apiURL}
				inputId="listObjectLayoutName"
				label={Liferay.Language.get('new-layout')}
				observer={observer}
				onClose={onClose}
			/>
		</ClayModalProvider>
	);
}
