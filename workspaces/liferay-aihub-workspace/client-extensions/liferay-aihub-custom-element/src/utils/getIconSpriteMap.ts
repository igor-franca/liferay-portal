/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import IconSVG from '../assets/icons.svg';

/**
 * Resolves the Clay icon spritemap URL. Inside Liferay the portal already
 * serves a full spritemap, so reuse it; on an arbitrary (non-Liferay) host page
 * `window.Liferay` is absent, so fall back to the minimal spritemap bundled at
 * build time (scripts/buildSpritemap.mjs). Same dual-mode pattern as
 * liferay-customer-custom-element and liferay-testray-custom-element.
 */
export default function getIconSpriteMap(): string {
	const pathThemeImages = (
		window as any
	).Liferay?.ThemeDisplay?.getPathThemeImages?.();

	return pathThemeImages ? `${pathThemeImages}/clay/icons.svg` : IconSVG;
}
