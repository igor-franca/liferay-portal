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

import React, {useRef, useState} from 'react';

import AutoComplete from './AutoComplete/index';
import CodeEditor, {SidebarCategory} from './CodeEditor/index';


export function Freemarker({sidebarElements}: IModalProps) {
	const editorRef = useRef<CodeMirror.Editor>(null);

	return (
        <CodeEditor
            error={""}
            onChange={() => {}}
            placeholder={
                `<#-- ${Liferay.Util.sub(
                    Liferay.Language.get(
                        'create-the-condition-of-the-action-using-the-expression-builder-type-x-to-use-the-autocomplete-feature'
                    ),
                    ['"${"']
                )} -->`
            }
            optinalComponent={(
				<AutoComplete
					emptyStateMessage=''
					items={[]}
					label=""
					onChangeQuery={() => {}}
					onSelectItem={() => {}}
					query=""
				>
					{() => (<></>)}
				</AutoComplete>
			)}
            ref={editorRef}
            sidebarElements={sidebarElements}
            value={""}
        />
    );
}

type Callback = (source?: string) => void;

interface IModalProps {
	sidebarElements: SidebarCategory[];
}
interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
	buttonDisabled?: boolean;
	component?: 'input' | 'textarea' | React.ForwardRefExoticComponent<any>;
	disabled?: boolean;
	error?: string;
	feedbackMessage?: string;
	hideFeedback?: boolean;
	id?: string;
	label?: string;
	name?: string;
	onOpenModal: () => void;
	required?: boolean;
	type?: 'number' | 'text';
	value?: string | number | string[];
}
