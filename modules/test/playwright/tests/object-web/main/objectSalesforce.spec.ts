/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {dataApiHelpersTest} from '../../../fixtures/dataApiHelpersTest';
import {featureFlagsTest} from '../../../fixtures/featureFlagsTest';
import {instanceSettingsPagesTest} from '../../../fixtures/instanceSettingsPagesTest';
import {isolatedSiteTest} from '../../../fixtures/isolatedSiteTest';
import {loginTest} from '../../../fixtures/loginTest';
import {objectPagesTest} from '../../../fixtures/objectPagesTest';
import getRandomString from '../../../utils/getRandomString';
import {waitForAlert} from '../../../utils/waitForAlert';
import {generateObjectFields} from './utils/generateObjectFields';

const salesforceLoginURL = process.env.SALESFORCE_LOGIN_URL;
const salesforceConsumerKey = process.env.SALESFORCE_CONSUMER_KEY;
const salesforceConsumerSecret = process.env.SALESFORCE_CONSUMER_SECRET;
const salesforceUsername = process.env.SALESFORCE_USERNAME;
const salesforcePassword = process.env.SALESFORCE_PASSWORD;

const test = mergeTests(
    dataApiHelpersTest,
    featureFlagsTest({
        'LPS-135430': {enabled: true},
    }),
    instanceSettingsPagesTest,
    isolatedSiteTest,
    loginTest(),
    objectPagesTest
);

test.beforeEach(async ({instanceSettingsPage, page}) => {
    test.skip(
        !salesforceLoginURL ||
            !salesforceConsumerKey ||
            !salesforceConsumerSecret ||
            !salesforceUsername ||
            !salesforcePassword,
        'Requires Salesforce environment variables.'
    );

    page.setViewportSize({height: 1080, width: 1920});

    await instanceSettingsPage.goToInstanceSetting(
        'Third Party',
        'Salesforce Integration'
    );

    await page.getByLabel('Consumer Key').fill(salesforceConsumerKey!);
    await page.getByLabel('Consumer Secret').fill(salesforceConsumerSecret!);
    await page.getByLabel('Login URL').fill(salesforceLoginURL!);

    // await page.getByLabel('Password').fill(salesforcePassword!);
    await page.locator('div.ddm-field[data-field-name="password"] input[type="password"]').fill(salesforcePassword!);

    await page.getByLabel('Username').fill(salesforceUsername!);

    await instanceSettingsPage.saveAndWaitForAlert();
});

test(
    'LPS-162131 Assert CRUD with created custom object using Salesforce storage type',
    {tag: '@LPS-162131'},
    async ({apiHelpers, page, viewObjectEntriesPage}) => {
        const objectFields = generateObjectFields({
            objectFieldBusinessTypes: [{
                businessType: 'Text',
                label: { en_US: 'Title' },
                name: 'title',
            }],
        });

        const objectDefinition = await apiHelpers.objectAdmin.postRandomObjectDefinition({
            objectFields,
            status: {code: 0},
        });

        const objectFieldValue = getRandomString();

        const objectFieldUpdatedValue = getRandomString();

        apiHelpers.data.push({
            id: objectDefinition.id,
            type: 'objectDefinition',
        });

        await test.step('create', async () => {
            await viewObjectEntriesPage.goto(objectDefinition.className);

            await viewObjectEntriesPage.clickAddObjectEntry(objectDefinition.label['en_US']);

            await viewObjectEntriesPage.fillObjectEntry({
                objectFieldBusinessType: 'Text',
                objectFieldLabel: 'Title',
                objectFieldValue: objectFieldValue,
            });

            await viewObjectEntriesPage.saveObjectEntryButton.click();
            
            await waitForAlert(page);

            await viewObjectEntriesPage.backButton.click();
        });

        await test.step('read', async () => {
            await expect(page.getByRole('cell', { name: objectFieldValue })).toBeVisible();
        });

        await test.step('update', async () => {
            await page.getByRole('button', {name: 'Actions'}).last().click();
            await page.getByRole('menuitem', {name: 'View'}).click();

            await viewObjectEntriesPage.fillObjectEntry({
                objectFieldBusinessType: 'Text',
                objectFieldLabel: 'Title',
                objectFieldValue: objectFieldUpdatedValue,
            });

            await viewObjectEntriesPage.saveObjectEntryButton.click();
            
            await expect(viewObjectEntriesPage.successMessage).toBeVisible();
        
            await viewObjectEntriesPage.backButton.click();

            await expect(page.getByRole('cell', { name: objectFieldUpdatedValue })).toBeVisible();
        });

        await test.step('delete', async () => {
            await viewObjectEntriesPage.frontendDatasetActions.last().click();

            await viewObjectEntriesPage.frontendDatasetDeleteAction.click();

            await viewObjectEntriesPage.deletionConfirmationModal
                .getByRole('button', { name: 'Delete' })
                .click();

            await expect(page.getByRole('cell', { name: objectFieldUpdatedValue })).toBeAttached({attached: false});
        });
    }
);