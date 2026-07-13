/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayDropDown from '@clayui/drop-down';
import React from 'react';

import AIAssistantPanelHeader from '../components/AIAssistantPanelHeader';

interface AIAssistantDropdownProps {
	active: boolean;
	children: React.ReactNode;
	onActiveChange: (active: boolean) => void;
	trigger: React.ReactElement;
}

const AIAssistantDropdown: React.FC<AIAssistantDropdownProps> = ({
	active,
	children,
	onActiveChange,
	trigger,
}) => {
	return (
		<ClayDropDown
			active={active}
			alignmentPosition={4}
			className="ai-assistant-chat__dropdown"
			hasRightSymbols={false}
			menuElementAttrs={{
				className: 'ai-assistant-chat__panel cadmin',
			}}
			onActiveChange={onActiveChange}
			trigger={trigger}
		>
			<div className="ai-assistant ai-assistant-chat__dropdown-container">
				<AIAssistantPanelHeader onClose={() => onActiveChange(false)} />

				{children}
			</div>
		</ClayDropDown>
	);
};

export default AIAssistantDropdown;
