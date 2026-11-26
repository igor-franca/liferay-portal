/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import fetchMock from 'fetch-mock';

import {
	OrderItem,
	getOrderItemKey,
	getPriorities,
	saveOrder,
} from '../../utils/arrangeOrder';

function field(externalReferenceCode: string, priority: number): OrderItem {
	return {externalReferenceCode, priority, type: 'objectField'};
}

function moved(...orderItems: OrderItem[]) {
	return new Set(orderItems.map(getOrderItemKey));
}

function relationship(
	externalReferenceCode: string,
	priority: number
): OrderItem {
	return {externalReferenceCode, priority, type: 'objectRelationship'};
}

describe('getPriorities', () => {
	it('moves an item halfway between its new neighbours', () => {
		const author = field('author', 4000);

		expect(
			getPriorities(
				[
					field('title', 1000),
					author,
					field('body', 2000),
					field('date', 3000),
				],
				moved(author)
			)
		).toEqual(new Map([['objectField#author', 1500]]));
	});

	it('moves an item to the top', () => {
		const author = field('author', 3000);

		expect(
			getPriorities(
				[author, field('title', 1000), field('body', 2000)],
				moved(author)
			)
		).toEqual(new Map([['objectField#author', 0]]));
	});

	it('moves an item to the bottom', () => {
		const title = field('title', 1000);

		expect(
			getPriorities(
				[field('body', 2000), field('author', 3000), title],
				moved(title)
			)
		).toEqual(new Map([['objectField#title', 4000]]));
	});

	it('spreads consecutive moved items between their neighbours', () => {
		const author = field('author', 3000);
		const messages = relationship('messages', 4000);

		expect(
			getPriorities(
				[field('title', 1000), author, messages, field('body', 2000)],
				moved(author, messages)
			)
		).toEqual(
			new Map([
				['objectField#author', 1333],
				['objectRelationship#messages', 1666],
			])
		);
	});

	it('moves separate items independently', () => {
		const author = field('author', 4000);
		const title = field('title', 1000);

		expect(
			getPriorities(
				[field('body', 2000), author, field('date', 3000), title],
				moved(author, title)
			)
		).toEqual(
			new Map([
				['objectField#author', 2500],
				['objectField#title', 4000],
			])
		);
	});

	it('numbers every item when all of them moved', () => {
		const body = field('body', 2000);
		const title = field('title', 1000);

		expect(getPriorities([body, title], moved(body, title))).toEqual(
			new Map([
				['objectField#body', 1000],
				['objectField#title', 2000],
			])
		);
	});

	it('renumbers the list when there is no room between the neighbours', () => {
		const author = field('author', 3000);

		expect(
			getPriorities(
				[field('title', 2000), author, field('body', 2001)],
				moved(author)
			)
		).toEqual(
			new Map([
				['objectField#author', 2000],
				['objectField#body', 3000],
				['objectField#title', 1000],
			])
		);
	});

	it('renumbers the list when the neighbours have the same priority', () => {
		const author = field('author', 2000);

		expect(
			getPriorities(
				[field('title', 1000), author, field('body', 1000)],
				moved(author)
			)
		).toEqual(new Map([['objectField#body', 3000]]));
	});

	it('changes nothing when no item moved', () => {
		expect(
			getPriorities(
				[field('title', 1000), field('body', 2000)],
				new Set()
			).size
		).toBe(0);
	});
});

describe('saveOrder', () => {
	const objectDefinition = {
		id: 42,
		objectActions: [{externalReferenceCode: 'notify', name: 'notify'}],
		objectFields: [
			{externalReferenceCode: 'title', name: 'title', priority: 1000},
			{externalReferenceCode: 'body', name: 'body', priority: 2000},
		],
		objectRelationships: [
			{
				externalReferenceCode: 'messages',
				name: 'messages',
				priority: 3000,
			},
		],
		objectValidationRules: [{externalReferenceCode: 'rule', name: 'rule'}],
	};

	const messages = relationship('messages', 3000);

	const orderItems = [field('title', 1000), messages, field('body', 2000)];

	const url = 'path:/o/object-admin/v1.0/object-definitions/42';

	afterEach(() => {
		fetchMock.hardReset();
	});

	beforeEach(() => {
		fetchMock.mockGlobal();
	});

	it('sends the object definition with the new priorities only', async () => {
		fetchMock.get(url, objectDefinition);
		fetchMock.put(url, 200, {name: 'put'});

		await saveOrder({
			movedKeys: moved(messages),
			objectDefinitionId: 42,
			orderItems,
		});

		const putCall = fetchMock.callHistory.lastCall('put');

		expect(JSON.parse(putCall?.options.body as string)).toEqual({
			...objectDefinition,
			objectRelationships: [
				{...objectDefinition.objectRelationships[0], priority: 1500},
			],
		});
	});

	it('stops when the fields changed since the order was loaded', async () => {
		fetchMock.get(url, {
			...objectDefinition,
			objectFields: [
				...objectDefinition.objectFields,
				{externalReferenceCode: 'date', name: 'date', priority: 4000},
			],
		});
		fetchMock.put(url, 200, {name: 'put'});

		await expect(
			saveOrder({
				movedKeys: moved(messages),
				objectDefinitionId: 42,
				orderItems,
			})
		).rejects.toEqual({type: 'ObjectDefinitionChanged'});

		expect(fetchMock.callHistory.called('put')).toBe(false);
	});

	it('throws the message of a failed save', async () => {
		fetchMock.get(url, objectDefinition);
		fetchMock.put(url, {body: {title: 'Something failed'}, status: 400});

		await expect(
			saveOrder({
				movedKeys: moved(messages),
				objectDefinitionId: 42,
				orderItems,
			})
		).rejects.toMatchObject({message: 'Something failed'});
	});
});
