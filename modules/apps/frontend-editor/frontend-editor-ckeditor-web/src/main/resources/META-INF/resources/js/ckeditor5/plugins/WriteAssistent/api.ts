/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {fetch} from 'frontend-js-web';
import {EventSource} from 'eventsource';
import {Action} from './types';

export function getEventSourceConnection() {
    const eventSource = new EventSource('/o/ai-hub/v1.0/tasks/subscribe', {
        withCredentials: true,
        fetch: (input, init) =>
            fetch(input as RequestInfo, {
                ...init,
                headers: new Headers({
                    'Accept': 'text/event-stream',
                    'x-csrf-token': Liferay.authToken,
                }),
            }),
    });

    return eventSource;
}

export async function postTasks(content: string, type: Action['type']) {
    await fetch(`/o/ai-hub/v1.0/tasks`, {
        body: JSON.stringify({
            context: {
                text: content,
            },
            type,
        }),
        headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }),
        method: 'POST',
    });
};