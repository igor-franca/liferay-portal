/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {afterEach, describe, expect, it} from 'vitest';

import getIconSpriteMap from '../../utils/getIconSpriteMap';

describe('getIconSpriteMap', () => {
	afterEach(() => {
		delete (window as any).Liferay;
	});

	it('falls back to the bundled spritemap when Liferay is absent', () => {
		const spritemap = getIconSpriteMap();

		expect(spritemap).toBeTruthy();
		expect(spritemap).not.toContain('/clay/icons.svg');
	});

	it('uses the portal spritemap path when Liferay is present', () => {
		(window as any).Liferay = {
			ThemeDisplay: {getPathThemeImages: () => '/o/theme/images'},
		};

		expect(getIconSpriteMap()).toBe('/o/theme/images/clay/icons.svg');
	});
});
