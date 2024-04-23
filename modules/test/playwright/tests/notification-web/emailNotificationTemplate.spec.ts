/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {apiHelpersTest} from '../../fixtures/apiHelpersTest';
import {loginTest} from '../../fixtures/loginTest';
import {notificationPagesTest} from '../../fixtures/notificationPagesTest';

export const test = mergeTests(
	apiHelpersTest,
	loginTest(),
	notificationPagesTest
);

test('can open edit email notification template page', async ({
	emailNotificationTemplatePage,
}) => {
	await emailNotificationTemplatePage.goto();

	expect(
		emailNotificationTemplatePage.getNotificationTemplateTitle(
			'Untitled Notification Template'
		)
	).toBeVisible();
	expect(
		emailNotificationTemplatePage.notificationTemplateLabel
	).toBeVisible();
});
