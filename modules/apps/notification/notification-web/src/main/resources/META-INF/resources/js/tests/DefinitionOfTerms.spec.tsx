/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import '@testing-library/jest-dom/extend-expect';
import {fireEvent, render, screen} from '@testing-library/react';
import React, {useState as useStateMock} from 'react';

// This import appears not to be used :/
import {fetch} from 'frontend-js-web';	

import {DefinitionOfTerms} from '../components/DefinitionOfTermsContainer/DefinitionOfTerms';

const objectDefinitions:Pick<ObjectDefinition, 'defaultLanguageId' | 'id' | 'label' | 'name'>[]  = [
    {
        defaultLanguageId: "en_US",
        id: 32103,
        label: {
            "en_US": "Postal Address"
        },
        name: "Address"
    },
    {
        defaultLanguageId: "en_US",
        id: 32113,
        label: {
            "en_US": "Account"
        },
        name: "AccountEntry"
    },
    {
        defaultLanguageId: "en_US",
        id: 32124,
        label: {
            "en_US": "Organization"
        },
        name: "Organization"
    },
];

const mockResponse = {
        relationshipSections: [], terms: [
            {
                termLabel: "Create Date",
                termName: "[%ADDRESS_CREATEDATE%]"
            },
            {
                termLabel: "Author Email Address",
                termName: "[%ADDRESS_AUTHOR_EMAIL_ADDRESS%]"
            },
            {
                termLabel: "Author Suffix",
                termName: "[%ADDRESS_AUTHOR_SUFFIX%]"
            }
        ]
    }

jest.mock('frontend-js-web', () => ({
    // This should replace the fetch function called within DefinitionOfTerms.tsx getObjectFieldTerms
    fetch: jest.fn(() => Promise.resolve(mockResponse)),
    sub: jest.fn(() => {})
  }));

jest.mock('react', () => ({
	...(jest.requireActual('react') as {}),
	useState: jest.fn(),
	useMemo: jest.fn(),
	useEffect: jest.fn()
}));

it('search an option', async() => {
    // @ts-ignore
	useStateMock.mockImplementation(initialValue => [false, jest.fn()]);

	render(
		<DefinitionOfTerms
			baseResourceURL={''}
			objectDefinitions={objectDefinitions}
		/>
	);

	fireEvent.click(screen.getByRole('combobox'));
	fireEvent.change(screen.getByText('select-an-option'), {
		target: {value: 'Account'},
	});

	expect(screen.getByText('Account')).toBeVisible();
});