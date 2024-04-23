/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
	MultiSelectItem,
	MultiSelectItemChild,
} from '@liferay/object-js-components-web';
import {createResourceURL, fetch} from 'frontend-js-web';

interface Roles {
	accountRoles: RoleTypes[];
	organizationRoles: RoleTypes[];
	regularRoles: RoleTypes[];
}

interface RoleTypes {
	label: string;
	name: string;
}

const accountLabels = {
	accountRoles: Liferay.Language.get('account-roles'),
	organizationRoles: Liferay.Language.get('organization-roles'),
	regularRoles: Liferay.Language.get('regular-roles'),
};

export async function getEmailNotificationRoles(baseResourceURL: string) {
	const response = await fetch(
		createResourceURL(baseResourceURL, {
			p_p_resource_id:
				'/notification_templates/get_email_notification_roles',
		}).toString()
	);

	const rolesResponse = (await response.json()) as Roles;

	const roles = [] as MultiSelectItem[];

	(Object.entries(rolesResponse) as [keyof Roles, RoleTypes[]][]).forEach(
		([accountRoleKey, accountRoleValues]) => {
			roles.push({
				children: accountRoleValues.map((accountInfo) => {
					return {
						checked: false,
						label: accountInfo.label,
						value: accountInfo.name,
					};
				}),
				label: accountLabels[accountRoleKey],
				value: accountRoleKey,
			});
		}
	);

	return roles;
}

export function getCheckedChildren(
	rolesNamesList: EmailNotificationRecipients[],
	children: MultiSelectItemChild[]
) {
	const rolesNames = rolesNamesList.map(({roleName}) => roleName);

	return children.map((child) => {
		return {
			...child,
			checked: rolesNames.includes(child.value),
		};
	});
}
