/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Locator, Page} from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly expenseRequestsHeading: Locator;
    readonly expenseTitle: Locator;
    readonly expenseAmount: Locator;
    readonly expenseDescription: Locator;
    readonly expenseDate: Locator;
    readonly expenseReceiptPhoto: Locator;
    readonly expenseSubmitButton: Locator;
    readonly expenseSucessMessage: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.expenseRequestsHeading = page.getByRole('heading', {name: 'Expense Requests', level: 1});
        this.expenseAmount = page.getByLabel('Amount (Read Only)');
        this.expenseDescription = page.getByLabel('Description (Read Only)');
        this.expenseDate = page.getByLabel('Expense Date (Read Only)');
        this.expenseReceiptPhoto = page.getByRole('button', { name: 'Select File' })
        this.expenseSubmitButton = page.getByRole('button', {name: 'Submit'});
        this.expenseTitle = page.getByRole('textbox', {name: 'Title'});
        this.expenseSucessMessage = page.getByText('Thank you. Your information was successfully received.');
    }

    async goto(siteUrl?: Site['friendlyUrlPath']) {
        await this.page.goto(
            `/web/liferay-reimbursement`,
            {waitUntil: 'load'}
        );
    }
}