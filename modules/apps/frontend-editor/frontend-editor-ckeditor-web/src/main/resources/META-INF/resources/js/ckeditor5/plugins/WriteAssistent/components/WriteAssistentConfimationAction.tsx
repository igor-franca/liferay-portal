/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayDropDown from '@clayui/drop-down';
import {fetch} from 'frontend-js-web';
import React, {useEffect, useRef, useState} from 'react';

interface ActionItem {
    disabled?: boolean;
    name: string;
    symbolLeft?: string;
    symbolRight?: string;
    type:
        | 'Improve Writing'
        | 'Fix Spelling Grammar'
        | 'Translate To'
        | 'Make Shorter'
        | 'Make Longer'
        | 'Generate Based On Title';
}

export default function WriteAssistentConfirmatinoAction({
    containerRef,
    content,
    handleAccept,
    handleDiscard,
}: {
    content: string;
	containerRef: HTMLElement;
    handleAccept: () => void;
    handleDiscard: () => void;
}) {
    const [active, setActive] = useState(true);

    const alignRef = useRef<HTMLElement | null>(null);
    const menuElementRef = useRef<HTMLDivElement | null>(null);

    const handleChange = async (type: ActionItem['type']) => {
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

    const actions = [
        {
            disabled: false,
            name: Liferay.Language.get('accept'),
            onClick: handleAccept,
            symbolLeft: 'check',
        },
        {
            disabled: false,
            name: Liferay.Language.get('discard'),
            onClick: handleDiscard,
            symbolLeft: 'times',
        },
        {
            disabled: true,
            name: Liferay.Language.get('regenerate'),
            symbolLeft: 'reset',
            onClick: handleChange
        },
    ];

    useEffect(() => {
        alignRef.current = containerRef ?? null;
    }, [containerRef]);

    return (
        <ClayDropDown.Menu
            active={active}
            alignElementRef={alignRef}
            onActiveChange={() => {
                setActive(!active);
            }}
            ref={menuElementRef}
        >
            <ClayDropDown.ItemList items={actions}>
                {(item: any) => (
                    <ClayDropDown.Item
                        disabled={item.disabled}
                        key={item.name}
                        onClick={() => handleChange(item.type)}
                        spritemap={
                            Liferay.ThemeDisplay.getPathThemeImages() +
                            '/clay/icons.svg'
                        }
                        symbolLeft={item.symbolLeft}
                    >
                        <span className="ml-4">{item.name}</span>
                    </ClayDropDown.Item>
                )}
            </ClayDropDown.ItemList>
        </ClayDropDown.Menu>
    );
}
