/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {apiHelpersTest} from '../../fixtures/apiHelpersTest';
import {featureFlagsTest} from '../../fixtures/featureFlagsTest';
import {loginTest} from '../../fixtures/loginTest';
import {notificationPagesTest} from '../../fixtures/notificationPagesTest';
import {getRandomInt} from '../../utils/getRandomInt';

export const test = mergeTests(
	apiHelpersTest,
	featureFlagsTest({
		'LPD-11165': true,
	}),
	loginTest(),
	notificationPagesTest
);

test('can add rich text source code and verify that the source code is being persisted', async ({
	emailNotificationTemplatePage,
	notificationTemplatesPage,
	page,
}) => {
	await emailNotificationTemplatePage.goto();

	const notificationTemplateName =
		'Notification Template Name' + getRandomInt();

	await emailNotificationTemplatePage.basicInfoName.fill(
		notificationTemplateName
	);

	await emailNotificationTemplatePage.senderEmailAddress.fill(
		'test@liferay.com'
	);

	await emailNotificationTemplatePage.senderName.fill('test user');

	await emailNotificationTemplatePage.primaryRecipientUserEmailAddress.fill(
		'test@liferay.com'
	);

	await emailNotificationTemplatePage.contentSubject.fill('Content subject');

	await emailNotificationTemplatePage.richTextSourceButton.click();

	await emailNotificationTemplatePage.richTextSourceField.fill(
		'<h1>Hello World</h1>'
	);

	await emailNotificationTemplatePage.saveButton.click();

	await notificationTemplatesPage
		.getFrontEndDatasetItemLocator(notificationTemplateName)
		.click();

	await emailNotificationTemplatePage.richTextSourceButton.click();

	await expect(page.getByText('<h1>Hello World</h1>')).toBeVisible();

	// Clean up

	await emailNotificationTemplatePage.backURLButton.click();

	await notificationTemplatesPage.frontEndDatasetItemActions.click();

	await notificationTemplatesPage.frontEndDatasetItemActionDelete.click();
});

test('can save recipients roles in email notification template', async ({
	emailNotificationTemplatePage,
	notificationTemplatesPage,
	page,
}) => {
	const primaryRecipientsRoles = [
		'Account Administrator',
		'Account Member',
		'Administrator',
		'Analytics Administrator',
		'Account Manager',
		'Organization Administrator',
	];

	const secondaryRecipientsRolesCC = [
		'Account Supplier',
		'Buyer',
		'Owner',
		'Portal Content Reviewer',
		'Organization Content Reviewer',
		'Organization Owner',
	];

	const secondaryRecipientsRolesBCC = [
		'Order Manager',
		'Power User',
		'Publications User',
		'Organization User',
	];

	await emailNotificationTemplatePage.goto();

	await emailNotificationTemplatePage.basicInfoName.fill(
		'Notification Template Name'
	);

	await emailNotificationTemplatePage.senderEmailAddress.fill(
		'test@liferay.com'
	);

	await emailNotificationTemplatePage.senderName.fill('test user');

	await emailNotificationTemplatePage.primaryRecipientType.click();

	await page.getByRole('option', {name: 'Roles'}).click();

	await emailNotificationTemplatePage.primaryRecipientRoles.click();

	for (const role of primaryRecipientsRoles) {
		await page
			.getByLabel(role, {exact: true})
			.locator('visible=true')
			.check();
	}

	await emailNotificationTemplatePage.secondaryRecipientTypeCC.click();

	await page.getByRole('option', {name: 'Roles'}).click();

	await emailNotificationTemplatePage.secondaryRecipientRolesCC.click();

	for (const role of secondaryRecipientsRolesCC) {
		await page
			.getByLabel(role, {exact: true})
			.locator('visible=true')
			.check();
	}

	await emailNotificationTemplatePage.secondaryRecipientTypeBCC.click();

	await page.getByRole('option', {name: 'Roles'}).click();

	await emailNotificationTemplatePage.secondaryRecipientRolesBCC.click();

	for (const role of secondaryRecipientsRolesBCC) {
		await page
			.getByLabel(role, {exact: true})
			.locator('visible=true')
			.check();
	}

	await emailNotificationTemplatePage.contentSubject.fill('Content subject');

	await emailNotificationTemplatePage.saveButton.click();

	await notificationTemplatesPage
		.getFrontEndDatasetItemLocator('Notification Template Name')
		.click();

	await emailNotificationTemplatePage.primaryRecipientRoles.click();

	for (const role of primaryRecipientsRoles) {
		await expect(
			page.getByLabel(role, {exact: true}).locator('visible=true')
		).toBeChecked();
	}

	await emailNotificationTemplatePage.secondaryRecipientRolesCC.click();

	for (const role of secondaryRecipientsRolesCC) {
		await expect(
			page.getByLabel(role, {exact: true}).locator('visible=true')
		).toBeChecked();
	}

	await emailNotificationTemplatePage.secondaryRecipientRolesBCC.click();

	for (const role of secondaryRecipientsRolesBCC) {
		await expect(
			page.getByLabel(role, {exact: true}).locator('visible=true')
		).toBeChecked();
	}

	// Clean up

	await emailNotificationTemplatePage.backURLButton.click();

	await notificationTemplatesPage.frontEndDatasetItemActions.click();

	await notificationTemplatesPage.frontEndDatasetItemActionDelete.click();
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

test('can see all general terms', async ({
	emailNotificationTemplatePage,
	page,
}) => {
	const mockGeneralTerms = [
		{
			label: 'Label',
			term: 'Term',
		},
		{
			label: 'Current User First Name',
			term: '[%CURRENT_USER_FIRST_NAME%]',
		},
		{
			label: 'Current User Prefix',
			term: '[%CURRENT_USER_PREFIX%]',
		},
		{
			label: 'Current Date',
			term: '[%CURRENT_DATE%]',
		},
		{
			label: 'Current User Last Name',
			term: '[%CURRENT_USER_LAST_NAME%]',
		},
		{
			label: 'Current User Middle Name',
			term: '[%CURRENT_USER_MIDDLE_NAME%]',
		},
		{
			label: 'Current User Email Address',
			term: '[%CURRENT_USER_EMAIL_ADDRESS%]',
		},
		{
			label: 'Current User ID',
			term: '[%CURRENT_USER_ID%]',
		},
		{
			label: 'Current User Suffix',
			term: '[%CURRENT_USER_SUFFIX%]',
		},
	];

	await emailNotificationTemplatePage.goto();

	await expect(
		page.getByRole('heading', {name: 'Definition of Terms'})
	).toBeVisible();

	await expect(
		page.getByRole('button', {name: 'General Terms'})
	).toBeVisible();

	const rows = await page.locator('.dnd-tr').all();

	for (let i = 0; i < rows.length; i++) {
		expect(await rows[i].innerText()).toStrictEqual(
			i >= 1
				? mockGeneralTerms[i].label +
						'\n' +
						mockGeneralTerms[i].term +
						'\n' +
						'Copy'
				: mockGeneralTerms[i].label + '\n' + mockGeneralTerms[i].term
		);
	}
});

test('can see entity terms', async ({emailNotificationTemplatePage, page}) => {
	const mockOrganizationTerms = [
		{
			label: 'Label',
			term: 'Term',
		},
		{
			label: 'Comments',
			term: '[%ORGANIZATION_COMMENT%]',
		},
		{
			label: 'Create Date',
			term: '[%ORGANIZATION_CREATEDATE%]',
		},
		{
			label: 'Author Email Address',
			term: '[%ORGANIZATION_AUTHOR_EMAIL_ADDRESS%]',
		},
		{
			label: 'Author Suffix',
			term: '[%ORGANIZATION_AUTHOR_SUFFIX%]',
		},
		{
			label: 'Author Prefix',
			term: '[%ORGANIZATION_AUTHOR_PREFIX%]',
		},
		{
			label: 'Author First Name',
			term: '[%ORGANIZATION_AUTHOR_FIRST_NAME%]',
		},
		{
			label: 'Author Last Name',
			term: '[%ORGANIZATION_AUTHOR_LAST_NAME%]',
		},
		{
			label: 'Author Middle Name',
			term: '[%ORGANIZATION_AUTHOR_MIDDLE_NAME%]',
		},
		{
			label: 'Author ID',
			term: '[%ORGANIZATION_AUTHOR_ID%]',
		},
		{
			label: 'External Reference Code',
			term: '[%ORGANIZATION_EXTERNALREFERENCECODE%]',
		},
		{
			label: 'ID',
			term: '[%ORGANIZATION_ID%]',
		},
		{
			label: 'Modified Date',
			term: '[%ORGANIZATION_MODIFIEDDATE%]',
		},
		{
			label: 'Name',
			term: '[%ORGANIZATION_NAME%]',
		},
		{
			label: 'Status',
			term: '[%ORGANIZATION_STATUS%]',
		},
	];

	await emailNotificationTemplatePage.goto();

	await page.getByRole('button', {name: 'General Terms'}).click();

	await page.getByText('Select an Option').click();

	const entities = [
		'Postal Address',
		'Account',
		'Organization',
		'User',
		'Commerce Product Group',
		'Commerce Order',
		'Commerce Order Item',
		'Commerce Product',
	];

	for (const entity of entities) {
		await expect(
			page.getByRole('option', {name: entity, exact: true})
		).toBeVisible();
	}

	await page.getByRole('option', {name: 'Organization'}).click();

	const rows = await page.locator('.fds').last().locator('.dnd-tr').all();

	for (let i = 0; i < rows.length; i++) {
		expect(await rows[i].innerText()).toStrictEqual(
			i >= 1
				? mockOrganizationTerms[i].label +
						'\n' +
						mockOrganizationTerms[i].term +
						'\n' +
						'Copy'
				: mockOrganizationTerms[i].label +
						'\n' +
						mockOrganizationTerms[i].term
		);
	}
});
