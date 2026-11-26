/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export interface OrderItem {
	externalReferenceCode: string;
	priority: number;
	type: 'objectField' | 'objectRelationship';
}

const PRIORITY_INTERVAL = 1000;

export function getOrderItemKey({externalReferenceCode, type}: OrderItem) {
	return `${type}#${externalReferenceCode}`;
}

export function getPriorities(orderItems: OrderItem[], movedKeys: Set<string>) {
	const priorities = new Map<string, number>();

	if (!movedKeys.size) {
		return priorities;
	}

	const moved = orderItems.map((orderItem) =>
		movedKeys.has(getOrderItemKey(orderItem))
	);
	const newPriorities = orderItems.map(({priority}) => priority);

	let start = 0;

	while (start < orderItems.length) {
		if (!moved[start]) {
			start++;

			continue;
		}

		let end = start;

		while (end < orderItems.length && moved[end]) {
			end++;
		}

		const count = end - start;
		const nextPriority =
			end < orderItems.length ? newPriorities[end] : null;
		const previousPriority = start > 0 ? newPriorities[start - 1] : null;

		for (let index = 0; index < count; index++) {
			let priority = (index + 1) * PRIORITY_INTERVAL;

			if (previousPriority !== null && nextPriority !== null) {
				priority =
					previousPriority +
					Math.floor(
						((nextPriority - previousPriority) * (index + 1)) /
							(count + 1)
					);
			}
			else if (previousPriority !== null) {
				priority = previousPriority + (index + 1) * PRIORITY_INTERVAL;
			}
			else if (nextPriority !== null) {
				priority = nextPriority - (count - index) * PRIORITY_INTERVAL;
			}

			newPriorities[start + index] = priority;
		}

		start = end;
	}

	for (let index = 1; index < orderItems.length; index++) {
		if (
			newPriorities[index] < newPriorities[index - 1] ||
			(newPriorities[index] === newPriorities[index - 1] &&
				(moved[index] || moved[index - 1]))
		) {
			for (let position = 0; position < orderItems.length; position++) {
				newPriorities[position] = (position + 1) * PRIORITY_INTERVAL;
			}

			break;
		}
	}

	orderItems.forEach((orderItem, index) => {
		if (newPriorities[index] !== orderItem.priority) {
			priorities.set(getOrderItemKey(orderItem), newPriorities[index]);
		}
	});

	return priorities;
}
