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

import {CustomVerticalBar} from '@liferay/object-js-components-web';
import React, {ReactNode} from 'react';

import './RightSidebarRoot.scss';

interface IRightSidebarRoot {
	children: ReactNode;
}

export function RightSideBarRoot({children}: IRightSidebarRoot) {
	return (
		<CustomVerticalBar
			defaultActive="objectsModelBuilderRightSidebar"
			panelWidth={320}
			position="right"
			resize={false}
			triggerSideBarAnimation={true}
			verticalBarItems={[
				{
					title: 'objectsModelBuilderRightSidebar',
				},
			]}
		>
			{children}
		</CustomVerticalBar>
	);
}
