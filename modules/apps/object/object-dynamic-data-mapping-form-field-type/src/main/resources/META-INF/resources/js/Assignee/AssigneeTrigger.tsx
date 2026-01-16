/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {forwardRef, Ref} from 'react';
import Avatar from './Avatar';
import {AssigneeValue} from './Assignee';
import classNames from 'classnames';

export interface AssigneeTriggerProps extends React.InputHTMLAttributes<HTMLInputElement> {
    customClasses?: string;
    selectedItem?: AssigneeValue | null | {};
}

function AssigneeTrigger(
    {customClasses, selectedItem, value, ...props}: AssigneeTriggerProps, 
    ref: Ref<HTMLInputElement>
) {
    const hasItem = selectedItem && 'name' in selectedItem;

    return (
        <div className={classNames(
                'object-field__assignee-trigger', customClasses
            )}>
            {hasItem && (
                <Avatar
                    image={(selectedItem as AssigneeValue).image}
                    name={(selectedItem as AssigneeValue).name || ''}
                />
            )}

            <input
                {...props}
                ref={ref}
                className="object-field__assignee-input"
                placeholder={Liferay.Language.get('unassigned')}
                value={value}
            />
        </div>
    );
}

export default forwardRef(AssigneeTrigger);