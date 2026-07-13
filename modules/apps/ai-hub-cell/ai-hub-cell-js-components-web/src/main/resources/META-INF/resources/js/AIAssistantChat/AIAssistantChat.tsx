/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayDropDown from '@clayui/drop-down';
import React, {useRef, useState} from 'react';

import ReportFeedbackModal from '../ReportFeedback/ReportFeedbackModal';
import AIAssistantChatSurface from './AIAssistantChatSurface';
import {ChatContext} from './api';
import AIAssistantPanelHeader from './components/AIAssistantPanelHeader';
import AIAssistantTrigger from './components/AIAssistantTrigger';
import useAIChat from './useAIChat';

import './chat.scss';

type AIState = 'focused' | 'result' | 'result-readonly' | 'working';

interface AIAssistantChatProps {
	aiState?: AIState;
	context?: ChatContext;
	embedded?: boolean;
	getContext?: () => ChatContext;
	hideTriggerLabel?: boolean;
	initialMessage?: string;
	instructionDefinitionScope: string;
	quickActions?: string[];
	triggerClassName?: string;
	triggerLabel?: string;
	triggerRound?: boolean;
}

const AIAssistantChat: React.FC<AIAssistantChatProps> = ({
	aiState,
	context,
	embedded = false,
	getContext,
	hideTriggerLabel = false,
	initialMessage,
	instructionDefinitionScope,
	quickActions,
	triggerClassName,
	triggerLabel,
	triggerRound = true,
}) => {
	const [active, setActive] = useState<boolean>(false);

	const chat = useAIChat({
		context,
		getContext,
		initialMessage,
		instructionDefinitionScope,
		onOpenRequested: () => setActive(true),
	});

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

	return (
		<ClayDropDown
			active={active}
			alignmentPosition={4}
			className="ai-assistant-chat__dropdown"
			hasRightSymbols={false}
			menuElementAttrs={{
				className: 'cadmin',
				style: {
					height: 552,
					maxHeight: 'none',
					maxWidth: 'none',
					overflow: 'hidden',
					width: 448,
				},
			}}
			onActiveChange={setActive}
			trigger={
				<AIAssistantTrigger
					className={triggerClassName}
					hideLabel={hideTriggerLabel}
					label={triggerLabel}
					ref={triggerRef}
					round={triggerRound}
				/>
			}
		>
			<div className="ai-assistant ai-assistant-chat__dropdown-container">
				<AIAssistantPanelHeader onClose={() => setActive(false)} />

				{chatSurface}
			</div>

			{reportFeedbackModal}
		</ClayDropDown>
	);
};

export default AIAssistantChat;
