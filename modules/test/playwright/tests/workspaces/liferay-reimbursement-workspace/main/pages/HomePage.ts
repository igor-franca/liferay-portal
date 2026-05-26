/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Locator, Page} from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly expenseAmount: Locator;
    readonly expenseAmountErrorMessage: Locator;
    readonly expenseDate: Locator;
    readonly expenseDescription: Locator;
    readonly expenseReceiptPhoto: Locator;
    readonly expenseRequestsHeading: Locator;
    readonly expenseSubmitButton: Locator;
    readonly expenseSucessMessage: Locator;
    readonly expenseTitle: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.expenseAmount = page.getByLabel('Amount');
        this.expenseAmountErrorMessage = page.getByText('The amount should be positive.');
        this.expenseDate = page.getByLabel('Date');
        this.expenseDescription = page.getByLabel('Description');
        this.expenseReceiptPhoto = page.getByRole('button', { name: 'Select File' })
        this.expenseRequestsHeading = page.getByRole('heading', {name: 'Expense Requests', level: 1});
        this.expenseSubmitButton = page.getByRole('button', {name: 'Submit'});
        this.expenseSucessMessage = page.getByText('Thank you. Your information was successfully received.');
        this.expenseTitle = page.getByRole('textbox', {name: 'Title'});
    }

    async goto() {
        await this.page.goto(
            `/web/reimbursement`,
            {waitUntil: 'load'}
        );
    }
}