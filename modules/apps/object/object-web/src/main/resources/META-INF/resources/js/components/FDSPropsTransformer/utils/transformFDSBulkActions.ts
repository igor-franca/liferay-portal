/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {IBulkActionItem} from '@liferay/frontend-data-set-web';

const BULK_ACTION_PERMISSION_KEYS: Record<string, string> = {
	delete: 'delete',
};

export default function transformFDSBulkActions(
	bulkActions: Array<IBulkActionItem>
): Array<IBulkActionItem> {
	return bulkActions.map((action: IBulkActionItem) => {
		const id = action?.data?.id as string;
		const permissionKey = id && BULK_ACTION_PERMISSION_KEYS[id];

		if (!permissionKey) {
			return action;
		}

		return {
			...action,
			isVisible: ({
				selectedItems,
			}: {
				selectedItems?: Array<any>;
			} = {}): boolean => {
				return (
					selectedItems?.every(
						(item: any) => item?.actions?.[permissionKey]
					) ?? false
				);
			},
		};
	});
}
