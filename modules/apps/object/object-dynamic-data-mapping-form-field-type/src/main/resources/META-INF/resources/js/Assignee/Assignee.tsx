/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import Autocomplete from '@clayui/autocomplete';
import {FetchPolicy, useResource} from '@clayui/data-provider';
import {FieldBase} from 'frontend-js-components-web';
import React, {useState} from 'react';

const searchURL = new URL(`${window.location.origin}/o/search/v1.0/search`);

const searchParams = {
	emptySearch: 'true',
	entryClassNames: [
		'com.liferay.portal.kernel.model.User',
		'com.liferay.portal.kernel.model.Role',
	].join(','),
	fields: [
		'entryClassName',
		'embedded.externalReferenceCode',
		'embedded.name',
		'embedded.image',
	].join(','),
	nestedFields: 'embedded',
};

searchURL.search = new URLSearchParams(searchParams).toString();

interface Assignee {
	disabled: boolean;
	error: string;
	id: string;
	label: string;
	name: string;
	onChange: (event: {target: {value: any}}) => void;
	required: boolean;
	value: {
		externalReferenceCode: string;
		image?: string;
		name: string;
		type: string;
	};
}

export default function Assignee({
	disabled,
	error,
	id,
	label,
	name: inputName,
	onChange,
	required,
	value,
}: Assignee) {
	const [search, setSearch] = useState('');
	const [networkStatus, setNetworkStatus] = useState(4);

	const {resource} = useResource({
		fetchOptions: {
			credentials: 'include',
			headers: new Headers({'x-csrf-token': Liferay.authToken}),
			method: 'GET',
		},
		fetchPolicy: FetchPolicy.CacheFirst,
		link: searchURL.href,
		onNetworkStatusChange: setNetworkStatus,
		variables: {search},
	});

	return (
		<FieldBase
			disabled={disabled}
			errorMessage={error}
			id={id}
			label={label}
			required={required}
		>
			<Autocomplete
				defaultValue={value?.name}
				id="object-entry-assignee_autocomplete"
				items={resource ? resource.items : []}
				loadingState={networkStatus}
				menuTrigger="focus"
				messages={{
					loading: Liferay.Language.get('loading...'),
					notFound: Liferay.Language.get('no-results-found'),
				}}
				onChange={(item: string) => {
					setSearch(item);
				}}
				onItemsChange={() => {}}
				value={search}
			>
				{(item: {
					embedded: {externalReferenceCode: string; name: string};
					entryClassName: string;
				}) => (
					<Autocomplete.Item
						key={item.embedded.name}
						onClick={() => {
							onChange({
								target: {
									value: {
										externalReferenceCode:
											item.embedded.externalReferenceCode,
										name: item.embedded.name,
										type: item.entryClassName
											.split('.')
											.pop(),
									},
								},
							});
						}}
					>
						{item.embedded.name}
					</Autocomplete.Item>
				)}
			</Autocomplete>

			<input name={inputName} type="hidden" value={JSON.stringify(value)} />
		</FieldBase>
	);
}
