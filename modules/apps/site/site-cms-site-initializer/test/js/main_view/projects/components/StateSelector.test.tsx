/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import React from 'react';

import StateSelector from '../../../../../src/main/resources/META-INF/resources/js/main_view/projects/components/StateSelector';

describe('StateSelector', () => {
	it('renders initial state label', () => {
		const states = [
			{key: 'not-started', name: 'Not Started'},
			{key: 'in-progress', name: 'In Progress'},
		];

		render(
			<StateSelector
				initialSelectedKey="not-started"
				onChange={async () => {}}
				states={states}
			/>
		);

		expect(screen.getByText('Not Started')).toBeInTheDocument();
	});
});
