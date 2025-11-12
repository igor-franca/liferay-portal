/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';
import {reimbursementPagesTest} from '../main/fixtures/reimbursementPagesTest';
import {customerPerformLogin, customerPerformLogout} from '../../liferay-customer-workspace/main/utils/customerLogin';
import {workflowPagesTest} from '../../../../fixtures/workflowPagesTest';
import {applicationsMenuPageTest} from '../../../../fixtures/applicationsMenuPageTest';

export const test = mergeTests(
	applicationsMenuPageTest,
	workflowPagesTest,
	reimbursementPagesTest,
	workflowPagesTest,
);

test.afterEach(async ({page}) => {
	await customerPerformLogout(page);
});

test.beforeEach(async ({page}) => {
	await customerPerformLogin(page, 'test@liferay.com');
});

test('Can submit a reimbursement request', async ({homePage}) => {
	await homePage.goto();

	await expect(homePage.expenseRequestsHeading).toBeVisible();

	await homePage.expenseTitle.fill('Dinner');
	await homePage.expenseAmount.fill('16.50');
	await homePage.expenseDescription.fill('Dinner in Madrid');
	await homePage.expenseDate.pressSequentially('11/17/2025');

	await homePage.expenseSubmitButton.click();

	await expect(homePage.expenseSucessMessage).toBeVisible();
});

test('Can configure the workflow for a reimbursement request', async ({applicationsMenuPage, configurationTabPage}) => {
		const assetType = 'Expense Approval Workflow';

		await applicationsMenuPage.goToProcessBuilder();

		await configurationTabPage.configurationTabLink.click();

		await configurationTabPage.assignWorkflowToAssetType(
			assetType,
			'Expense Request'
		);

		expect(configurationTabPage.page.getByRole('cell', {name: 'Expense Approval Workflow'})).toBeVisible();
});

test('Can approve a reimbursement request', async ({homePage, workflowTasksPage, page}) => {
	await workflowTasksPage.goToAssignedToMyRoles();

	await workflowTasksPage.assignToMe('Dinner3');

	await page.getByRole('button', ({ name: 'Open Actions Menu'})).last().click();
	await page.getByRole('menuitem', ({ name: 'Approve'})).click();
});	