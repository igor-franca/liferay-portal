/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import {VerticalBar} from '@clayui/core';
import classNames from 'classnames';
import React, {ReactNode} from 'react';

import './ObjectVerticalBar.scss';

interface ObjectVerticalBarProps {
	children: ReactNode;
	defaultActive: string;
	triggerSideBarAnimation: boolean;
	verticalBaritems: {
		title: string;
	}[];
}

export function ObjectVerticalBar({
	children,
	defaultActive,
	triggerSideBarAnimation,
	verticalBaritems,
}: ObjectVerticalBarProps) {
	return (
		<VerticalBar
			className={classNames(
				triggerSideBarAnimation
					? 'lfr__object-vertical-bar--open'
					: 'lfr__object-vertical-bar--closed'
			)}
			defaultActive={defaultActive}
			defaultPanelWidth={1000}
			panelWidthMax={1200}
			panelWidthMin={400}
			position="right"
			resize
		>
			<div className="lfr__object-vertical-bar-content">
				<VerticalBar.Content items={verticalBaritems}>
					{(item) => (
						<VerticalBar.Panel key={item.title}>
							{children}
						</VerticalBar.Panel>
					)}
				</VerticalBar.Content>
			</div>
		</VerticalBar>
	);
}
