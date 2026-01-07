/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';
import React from 'react';

import InfoSummary from '../../../../../src/main/resources/META-INF/resources/js/main_view/projects/components/InfoSummary';

describe('InfoSummary', () => {
	it('renders items and toggles visibility', () => {
		const items = [
			{label: 'One', value: 'Value One'},
			{label: 'Two', value: <span>Value Two</span>},
		];

		render(<InfoSummary defaultOpen={true} items={items} title="Test" />);

		expect(screen.getByText('Test')).toBeInTheDocument();
		expect(screen.getByText('One')).toBeInTheDocument();
		expect(screen.getByText('Value One')).toBeInTheDocument();

		const button = document.querySelector('button')!;

		fireEvent.click(button);

		expect(screen.queryByText('Value One')).not.toBeInTheDocument();
	});
});
