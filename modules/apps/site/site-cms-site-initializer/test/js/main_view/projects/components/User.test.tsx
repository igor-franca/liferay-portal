/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import React from 'react';

import User from '../../../../../src/main/resources/META-INF/resources/js/main_view/projects/components/User';

describe('User component', () => {
	it('renders name and avatar when image provided', () => {
		render(<User image="/avatar.jpg" name="Jane Doe" />);

		const image = screen.getByAltText('Jane Doe') as HTMLImageElement;

		expect(image).toBeInTheDocument();
		expect(image.src).toContain('/avatar.jpg');
		expect(screen.getByText('Jane Doe')).toBeInTheDocument();
	});

	it('renders only name when no image provided', () => {
		render(<User name="John" />);

		expect(screen.getByText('John')).toBeInTheDocument();
		expect(screen.queryByRole('img')).not.toBeInTheDocument();
	});
});
