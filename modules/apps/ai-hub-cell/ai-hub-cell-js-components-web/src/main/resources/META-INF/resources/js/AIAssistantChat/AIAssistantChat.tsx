/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useId, useRef, useState} from 'react';

import ReportFeedbackModal from '../ReportFeedback/ReportFeedbackModal';
import AIAssistantChatSurface from './AIAssistantChatSurface';
import {ChatContext} from './api';
import AIAssistantTrigger from './components/AIAssistantTrigger';
import AIAssistantDropdown from './shells/AIAssistantDropdown';
import AIAssistantSidebar from './shells/AIAssistantSidebar';
import useAIChat from './useAIChat';

import './chat.scss';

type AIState = 'focused' | 'result' | 'result-readonly' | 'working';

export type AIAssistantDisplayMode = 'dropdown' | 'sidebar' | 'toggle';

interface AIAssistantChatProps {
	aiState?: AIState;
	context?: ChatContext;
	displayMode?: AIAssistantDisplayMode;
	embedded?: boolean;
	getContext?: () => ChatContext;
	hideTriggerLabel?: boolean;
	initialMessage?: string;
	instructionDefinitionScope: string;
	pushContainer?: string;
	quickActions?: string[];
	sidebarBehavior?: 'overlay' | 'push';
	triggerClassName?: string;
	triggerLabel?: string;
	triggerRound?: boolean;
}

const AIAssistantChat: React.FC<AIAssistantChatProps> = ({
	aiState,
	context,
	displayMode = 'toggle',
	embedded = false,
	getContext,
	hideTriggerLabel = false,
	initialMessage,
	instructionDefinitionScope,
	pushContainer,
	quickActions,
	sidebarBehavior,
	triggerClassName,
	triggerLabel,
	triggerRound = true,
}) => {
	const [expanded, setExpanded] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);

	const chat = useAIChat({
		context,
		getContext,
		initialMessage,
		instructionDefinitionScope,
		onOpenRequested: () => setOpen(true),
	});

	const sidebarId = useId();
	const triggerRef = useRef<HTMLButtonElement | null>(null);

	const chatSurface = (
		<AIAssistantChatSurface
			aiState={aiState}
			chat={chat}
			quickActions={quickActions}
			showGreeting={!initialMessage}
		/>
	);

	const reportFeedbackModal = chat.reportContext !== null && (
		<ReportFeedbackModal
			agentDefinitionExternalReferenceCodes={
				chat.reportContext.agentDefinitionExternalReferenceCodes
			}
			onClose={() => chat.setReportContext(null)}
			onSubmitted={() =>
				chat.markFeedbackGiven(chat.reportContext!.index)
			}
			surface="aiAssistant"
		/>
	);

	if (embedded) {
		return (
			<>
				<div className="ai-assistant ai-assistant-chat__embedded">
					{chatSurface}
				</div>

				{reportFeedbackModal}
			</>
		);
	}

	const sidebarActive =
		displayMode === 'sidebar' || (displayMode === 'toggle' && expanded);

	const trigger = (
		<AIAssistantTrigger
			className={triggerClassName}
			hideLabel={hideTriggerLabel}
			label={triggerLabel}
			ref={triggerRef}
			round={triggerRound}
		/>
	);

	return (
		<>
			{sidebarActive ? (
				React.cloneElement(trigger, {
					'aria-controls': sidebarId,
					'aria-expanded': open,
					'onClick': () => setOpen(!open),
				})
			) : (
				<AIAssistantDropdown
					active={open}
					onActiveChange={setOpen}
					onExpand={
						displayMode === 'toggle'
							? () => setExpanded(true)
							: undefined
					}
					trigger={trigger}
				>
					{chatSurface}
				</AIAssistantDropdown>
			)}

			{displayMode !== 'dropdown' && (

				// The sidebar stays mounted while it can appear: unmounting
				// Clay's SidePanel while open leaks its c-slideout classes on
				// the push container, and staying mounted preserves the exit
				// animation.

				<AIAssistantSidebar
					behavior={sidebarBehavior}
					id={sidebarId}
					onCollapse={
						displayMode === 'toggle'
							? () => {
									setExpanded(false);

									requestAnimationFrame(() =>
										triggerRef.current?.focus()
									);
								}
							: undefined
					}
					onOpenChange={setOpen}
					open={open && sidebarActive}
					pushContainer={pushContainer}
					triggerRef={triggerRef}
				>
					{sidebarActive ? chatSurface : null}
				</AIAssistantSidebar>
			)}

			{reportFeedbackModal}
		</>
	);
};

export default AIAssistantChat;
