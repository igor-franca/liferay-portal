/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

// @ts-ignore

import {test} from '@playwright/test';

import {EmailPage} from '../pages/notification-web/EmailPage';
import {QueuePage} from '../pages/notification-web/QueuePage';
import {TemplatesPage} from '../pages/notification-web/TemplatesPage';

const notificationPagesTest = test.extend<{
	emailPage: EmailPage;
	queuePage: QueuePage;
	templatesPage: TemplatesPage;
}>({
	emailPage: async ({page}, use) => {
		await use(new EmailPage(page));
	},
	queuePage: async ({page}, use) => {
		await use(new QueuePage(page));
	},
	templatesPage: async ({page}, use) => {
		await use(new TemplatesPage(page));
	},
});

export {notificationPagesTest};
