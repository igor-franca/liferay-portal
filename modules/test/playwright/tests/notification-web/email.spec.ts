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

test('can open edit email notification template page', async ({emailPage}) => {
	await emailPage.goto();

	expect(emailPage.getNotificationTemplateTitle('Untitled Notification Template')).toBeVisible();
	expect(emailPage.notificationTemplateLabel).toBeVisible();
});

test('can see all role groups in multiselect field when create a new notification template', async ({emailPage, page}) => {
	await emailPage.goto();

	for (const recipientTypeSingleSelect of await emailPage.recipientTypeSingleSelect.all()) {
		await recipientTypeSingleSelect.click();

		await page.getByRole('option', { name: 'Roles' }).click();

		const selectRoleInputCount = await page.getByPlaceholder('Select Role').count();

		const testLocator = await page.getByPlaceholder('Select Role').all();

		if(selectRoleInputCount > 1) {
			await page.getByPlaceholder('Select Role').nth(selectRoleInputCount).click();
		}

		else {
			await page.getByPlaceholder('Select Role').click();
		}

		await page.getByText('Account Roles', { exact: true }).click();

		await page.getByText('Regular Roles').click();

		await page.getByText('Organization Roles').click();

		await page.keyboard.press('Escape');
	}
});
