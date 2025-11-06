/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {EventSource} from 'eventsource';
import {fetch} from 'frontend-js-web';

import {EActionType, EChangeToneType} from './types';

export function createEventSourceConnection() {
	const eventSource = new EventSource('/o/ai-hub/v1.0/tasks/subscribe', {
		fetch: (input, init) =>
			fetch(input as RequestInfo, {
				...init,
				headers: new Headers({
					'Accept': 'text/event-stream',
					'x-csrf-token': Liferay.authToken,
				}),
			}),
		withCredentials: true,
	});

	return eventSource;
}

export interface IpostTasks {
	context: {
		language?: Liferay.Language.Locale;
		text: string;
		tone?: EChangeToneType;
	};
	type: EActionType;
}

export async function postTasks({context, type}: IpostTasks) {
	await fetch(`/o/ai-hub/v1.0/tasks`, {
		body: JSON.stringify({
			context,
			type,
		}),
		headers: new Headers({
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		}),
		method: 'POST',
	});
}
