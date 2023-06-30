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

import classNames from 'classnames';
import React from 'react';

export default function ObjectActionLastExecutionDataRenderer({
	itemData,
}: {
	itemData: ObjectAction;
}) {
	return (
		<strong
			className={classNames(
				'label',
				itemData.status.label === 'never-ran'
					? 'label-info'
					: itemData.status.label === 'failed'
					? 'label-danger'
					: 'label-success'
			)}
		>
			{itemData.status.label === 'never-ran'
				? Liferay.Language.get('never-ran')
				: itemData.status.label === 'failed'
				? Liferay.Language.get('failed')
				: Liferay.Language.get('success')}
		</strong>
	);
}
