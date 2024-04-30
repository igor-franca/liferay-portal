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

test('can see all roles groups in email notification template recipients', async ({
	emailNotificationTemplatePage,
	page,
}) => {
	await emailNotificationTemplatePage.goto();

	await emailNotificationTemplatePage.primaryRecipientType.click();
	await page.getByRole('option', {name: 'Roles'}).click();
	await emailNotificationTemplatePage.primaryRecipientRoles.click();
	await expect(
		emailNotificationTemplatePage.accountRolesGroupTitle
	).toBeVisible();
	await expect(
		emailNotificationTemplatePage.regularRolesGroupTitle
	).toBeVisible();
	await expect(
		emailNotificationTemplatePage.organizationRolesGroupTitle
	).toBeVisible();
	await page.keyboard.press('Escape');

	await emailNotificationTemplatePage.secondaryRecipientTypeCC.click();
	await page.getByRole('option', {name: 'Roles'}).click();
	await emailNotificationTemplatePage.secondaryRecipientRolesCC.click();
	await expect(
		emailNotificationTemplatePage.accountRolesGroupTitle
	).toBeVisible();
	await expect(
		emailNotificationTemplatePage.regularRolesGroupTitle
	).toBeVisible();
	await expect(
		emailNotificationTemplatePage.organizationRolesGroupTitle
	).toBeVisible();
	await page.keyboard.press('Escape');

	await emailNotificationTemplatePage.secondaryRecipientTypeBCC.click();
	await page.getByRole('option', {name: 'Roles'}).click();
	await emailNotificationTemplatePage.secondaryRecipientRolesBCC.click();
	await expect(
		emailNotificationTemplatePage.accountRolesGroupTitle
	).toBeVisible();
	await expect(
		emailNotificationTemplatePage.regularRolesGroupTitle
	).toBeVisible();
	await expect(
		emailNotificationTemplatePage.organizationRolesGroupTitle
	).toBeVisible();
});
