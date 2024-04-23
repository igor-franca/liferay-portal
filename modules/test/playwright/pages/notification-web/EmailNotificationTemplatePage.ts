/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Locator, Page} from '@playwright/test';

import {PORTLET_URLS} from '../../utils/portletUrls';

export class EmailNotificationTemplatePage {
	readonly page: Page;
	readonly notificationTemplateLabel: Locator;
	readonly notificationTemplateTitle: Locator;

	constructor(page: Page) {
		this.page = page;
		this.notificationTemplateTitle = page
			.getByRole('navigation')
			.getByRole('heading');
		this.notificationTemplateLabel = page
			.getByRole('navigation')
			.getByRole('strong')
			.getByText('email');
	}

	getNotificationTemplateTitle(notificationName: string) {
		return this.notificationTemplateTitle.getByText(notificationName);
	}

	async goto(siteUrl?: Site['friendlyUrlPath']) {
		await this.page.goto(
			`/group${siteUrl || '/guest'}${
				PORTLET_URLS.editNotificationTemplate
			}&_com_liferay_notification_web_internal_portlet_NotificationTemplatesPortlet_notificationTemplateType=email`,
			{waitUntil: 'load'}
		);
	}
}
