/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {SidePanel} from '@clayui/core';
import {ReactPortal} from '@liferay/frontend-js-react-web';
import React, {useEffect, useMemo} from 'react';

import AIAssistantPanelHeader from '../components/AIAssistantPanelHeader';

// Must match $ai-assistant-sidebar-width in chat.scss.

const SIDEBAR_WIDTH = 448;

interface AIAssistantSidebarProps {
	behavior?: 'overlay' | 'push';
	children: React.ReactNode;
	id?: string;
	onCollapse?: () => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	pushContainer?: string;
	triggerRef?: React.RefObject<HTMLElement>;
}

const AIAssistantSidebar: React.FC<AIAssistantSidebarProps> = ({
	behavior = 'push',
	children,
	id,
	onCollapse,
	onOpenChange,
	open,
	pushContainer = '#wrapper',
	triggerRef,
}) => {
	const containerRef = useMemo<React.RefObject<HTMLElement>>(
		() => ({
			current:
				behavior === 'push'
					? document.querySelector<HTMLElement>(pushContainer)
					: null,
		}),
		[behavior, pushContainer]
	);

	useEffect(() => {
		const container = containerRef.current;

		if (!container || !open) {
			return;
		}

		container.classList.add('ai-assistant-sidebar-push');

		return () => {
			container.classList.remove('ai-assistant-sidebar-push');
		};
	}, [containerRef, open]);

	return (
		<ReactPortal className="ai-assistant-sidebar-root cadmin">
			<SidePanel
				aria-label={Liferay.Language.get('ai-assistant')}
				as="aside"
				className="ai-assistant-sidebar"
				containerRef={containerRef}
				id={id}
				onOpenChange={onOpenChange}
				open={open}
				panelWidth={SIDEBAR_WIDTH}
				position="fixed"
				triggerRef={triggerRef}
			>
				<AIAssistantPanelHeader
					expanded
					onClose={() => onOpenChange(false)}
					onToggleExpanded={onCollapse}
				/>

				<div className="ai-assistant ai-assistant-chat__sidebar-container">
					{children}
				</div>
			</SidePanel>
		</ReactPortal>
	);
};

export default AIAssistantSidebar;
