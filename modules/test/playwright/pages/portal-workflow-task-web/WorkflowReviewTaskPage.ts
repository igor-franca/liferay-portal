/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {FrameLocator, Locator, Page} from '@playwright/test';

import {waitForSuccessAlert} from '../../utils/waitForSuccessAlert';
import {WorkflowTasksPage} from './WorkflowTasksPage';

export class WorkflowReviewTaskPage {
	readonly page: Page;
	readonly approveMenuItem: Locator;
	readonly assignToMenuItem: Locator;
	readonly doneAssigneeButton: Locator;
	readonly doneButton: Locator;
	readonly reviewActionMenu: Locator;
	readonly reviewComment: Locator;
	readonly workflowTasksPage: WorkflowTasksPage;
	assignee: FrameLocator;

	constructor(page: Page) {
		this.page = page;
		this.approveMenuItem = page.getByRole('menuitem', {name: 'approve'});
		this.assignToMenuItem = page.getByRole('link', {name: 'Assign to...'});
		this.doneAssigneeButton = page.getByRole('button', {name: 'Done'});
		this.doneButton = page.getByRole('button', {name: 'Done'});
		this.reviewActionMenu = page.locator(
			'[id="_com_liferay_portal_workflow_task_web_portlet_MyWorkflowTaskPortlet_kldx___menu"]'
		);
		this.reviewComment = page.getByRole('textbox', {name: 'Comment'});
		this.workflowTasksPage = new WorkflowTasksPage(page);
	}

	async clickApproveMenuItem() {
		await this.approveMenuItem.click();
	}

	async fillReviewComment(comment: string) {
		await this.reviewComment.fill(comment);
	}

	async selectAssignee(assignee: string) {
		await this.page
			.frameLocator(
				'iframe[name="_com_liferay_portal_workflow_task_web_portlet_MyWorkflowTaskPortlet_assignToDialog_iframe_"]'
			)
			.getByLabel('Assign to')
			.selectOption(assignee);
	}

	async clickDoneButton() {
		await this.doneButton.click();

		await waitForSuccessAlert(this.page);
	}

	async clickDoneAssigneeButton() {
		await this.page
			.frameLocator(
				'iframe[name="_com_liferay_portal_workflow_task_web_portlet_MyWorkflowTaskPortlet_assignToDialog_iframe_"]'
			)
			.getByRole('button', {name: 'Done'})
			.click();

		await waitForSuccessAlert(this.page);
	}
}
