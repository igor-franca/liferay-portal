/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Align, ClayDropDownWithItems} from '@clayui/drop-down';
import {Item} from '@clayui/drop-down/lib/Items';
import React, {useEffect, useRef, useState} from 'react';

import {EActionType, EChangeToneType} from '../types';

type handleActionClick = {
	language?: Liferay.Language.Locale;
	tone?: EChangeToneType;
	type: EActionType;
};

export default function WritingAssistantActions({
	containerRef,
	handleActionClick,
	positions,
}: {
	containerRef:
		| HTMLElement
		| React.ReactElement
		| React.RefObject<HTMLElement | null>
		| null;
	handleActionClick: ({
		language,
		tone,
		type,
	}: handleActionClick) => Promise<void>;
	positions: string[];
}) {
	const [internalActive, setInternalActive] = useState(true);
	const [isLoading, setIsLoading] = useState<
		EActionType | EChangeToneType | ''
	>();

	const alignRef = useRef<HTMLElement | null>(null);

	const handleClick = async ({language, tone, type}: handleActionClick) => {
		setIsLoading(type);

		await handleActionClick({language, tone, type});
	};

	const items: Item[] = [
		{
			label: Liferay.Language.get('suggested'),
			items: [
				{
					label: Liferay.Language.get('improve-writing'),
					onClick: () =>
						handleClick({type: EActionType.IMPROVE_WRITING}),
					symbolLeft: 'magic',
					type: 'item',
					...(isLoading === EActionType.IMPROVE_WRITING && {
						symbolRight: 'staging',
						disabled: true,
					}),
				},
				{
					label: Liferay.Language.get('fix-spelling-and-grammar'),
					onClick: () =>
						handleClick({
							type: EActionType.FIX_SPELLING_AND_GRAMMAR,
						}),
					symbolLeft: 'check',
					type: 'item',
					...(isLoading === EActionType.FIX_SPELLING_AND_GRAMMAR && {
						symbolRight: 'staging',
						disabled: true,
					}),
				},
				{
					disabled: true,
					items: [],
					label: Liferay.Language.get('translate-to'),
					symbolLeft: 'automatic-translate',
					type: 'contextual',
				},
			],
			type: 'group',
		},
		{type: 'divider'},
		{
			items: [
				{
					label: Liferay.Language.get('make-shorter'),
					onClick: () =>
						handleClick({type: EActionType.MAKE_SHORTER}),
					symbolLeft: 'bars',
					type: 'item',
					...(isLoading === EActionType.MAKE_SHORTER && {
						disabled: true,
						symbolRight: 'staging',
					}),
				},
				{
					disabled: false,
					label: Liferay.Language.get('make-longer'),
					onClick: () => handleClick({type: EActionType.MAKE_LONGER}),
					symbolLeft: 'align-justify',
					type: 'item',
					...(isLoading === EActionType.MAKE_LONGER && {
						disabled: true,
						symbolRight: 'staging',
					}),
				},
				{
					label: Liferay.Language.get('change-tone'),
					items: [
						{
							onClick: () =>
								handleClick({
									type: EActionType.CHANGE_TONE,
									tone: EChangeToneType.FORMAL,
								}),
							label: Liferay.Language.get('formal'),
							type: 'item',
							...(isLoading === EChangeToneType.FORMAL && {
								disabled: true,
								symbolRight: 'staging',
							}),
						},
						{
							onClick: () =>
								handleClick({
									type: EActionType.CHANGE_TONE,
									tone: EChangeToneType.FRIENDLY,
								}),
							label: Liferay.Language.get('friendly'),
							type: 'item',
							...(isLoading === EChangeToneType.FRIENDLY && {
								disabled: true,
								symbolRight: 'staging',
							}),
						},
						{
							onClick: () =>
								handleClick({
									type: EActionType.CHANGE_TONE,
									tone: EChangeToneType.CASUAL,
								}),
							label: Liferay.Language.get('casual'),
							type: 'item',
							...(isLoading === EChangeToneType.FORMAL && {
								disabled: true,
								symbolRight: 'staging',
							}),
						},
						{
							onClick: () =>
								handleClick({
									type: EActionType.CHANGE_TONE,
									tone: EChangeToneType.PERSUASIVE,
								}),
							label: Liferay.Language.get('persuasive'),
							type: 'item',
							...(isLoading === EChangeToneType.PERSUASIVE && {
								disabled: true,
								symbolRight: 'staging',
							}),
						},
					],
					symbolRight: 'angle-right-small',
					type: 'contextual',
					...(isLoading === EActionType.CHANGE_TONE && {
						disabled: true,
						type: 'item',
						symbolRight: 'staging',
					}),
				},
			],
			label: Liferay.Language.get('edit'),
			type: 'group',
		},
		{type: 'divider'},
		{
			items: [
				{
					disabled: true,
					label: Liferay.Language.get('title'),
					value: 'Tile',
					type: 'item',
				},
			],
			label: Liferay.Language.get('generate-based-on'),
			type: 'group',
		},
	];

	const triggerElement = <span ref={alignRef} />;

	useEffect(() => {
		if (!containerRef) {
			alignRef.current = null;

			return;
		}

		if (typeof containerRef === 'object' && 'current' in containerRef) {
			alignRef.current = containerRef.current ?? null;

			return;
		}

		if (containerRef instanceof HTMLElement) {
			alignRef.current = containerRef;

			return;
		}

		return () => {
			setInternalActive(false);
		};
	}, [containerRef]);

	return (
		<ClayDropDownWithItems
			closeOnClickOutside={false}
			active={internalActive}
			alignmentPosition={
				positions[0] === 'arrow_n' ? Align.BottomLeft : Align.TopLeft
			}
			items={items}
			onActiveChange={() => {}}
			spritemap={
				Liferay.ThemeDisplay.getPathThemeImages() + '/clay/icons.svg'
			}
			trigger={triggerElement}
		/>
	);
}
