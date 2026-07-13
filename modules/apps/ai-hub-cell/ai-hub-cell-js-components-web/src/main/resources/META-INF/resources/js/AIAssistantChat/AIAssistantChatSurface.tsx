/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayForm from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import React, {useEffect, useRef} from 'react';

import AIAssistantFooterDisclaimer from './components/AIAssistantFooterDisclaimer';
import AIAssistantMessageBalloon from './components/AIAssistantMessageBalloon';
import CategorizationMessageBalloon from './components/CategorizationMessageBalloon';
import UserMessageBalloon from './components/UserMessageBalloon';
import {AIChat} from './useAIChat';

type AIState = 'focused' | 'result' | 'result-readonly' | 'working';

interface AIAssistantChatSurfaceProps {
	aiState?: AIState;
	chat: AIChat;
	quickActions?: string[];
	showGreeting: boolean;
}

const AIAssistantChatSurface: React.FC<AIAssistantChatSurfaceProps> = ({
	aiState,
	chat,
	quickActions,
	showGreeting,
}) => {
	const {
		feedbackGiven,
		giveThumbsUp,
		isGenerating,
		message,
		messages,
		messagesEndRef,
		sendMessage,
		setMessage,
		setReportContext,
	} = chat;

	const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

	// Re-parenting the surface into another shell remounts the DOM and loses
	// the scroll position, so anchor to the newest message again on mount.

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView();
	}, [messagesEndRef]);

	function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		sendMessage(message);
	}

	function adjustTextAreaHeight(element: HTMLTextAreaElement) {
		const textArea = element ?? textAreaRef.current;

		if (!textArea) {
			return;
		}

		const style = window.getComputedStyle(textArea);
		const lineHeight =
			parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
		const maxHeight = lineHeight * 4;

		textArea.style.height = 'auto';
		const newHeight = Math.min(textArea.scrollHeight, maxHeight);
		textArea.style.height = `${newHeight}px`;
		textArea.style.overflowY =
			textArea.scrollHeight > maxHeight ? 'auto' : 'hidden';
	}

	function handleTextAreaKeyDown(
		event: React.KeyboardEvent<HTMLTextAreaElement>
	) {
		if (event.key !== 'Enter') {
			event.stopPropagation();

			return;
		}

		if (event.shiftKey) {
			setTimeout(
				() => adjustTextAreaHeight(event.target as HTMLTextAreaElement),
				0
			);

			return;
		}

		event.preventDefault();

		const form = (event.target as HTMLElement).closest(
			'form'
		) as HTMLFormElement | null;

		if (form?.requestSubmit) {
			form.requestSubmit();
		}
		else {
			form?.dispatchEvent(
				new Event('submit', {
					bubbles: true,
					cancelable: true,
				})
			);
		}
	}

	return (
		<>
			<div className="ai-assistant-chat__messages-container">
				{showGreeting && (
					<AIAssistantMessageBalloon
						error={false}
						message="Hi! I can help you generate content, titles, tags, or
						translate your work. What would you like to do?"
					/>
				)}

				{messages.map((item, index) => {
					if (item.sender === 'user') {
						return (
							<UserMessageBalloon
								key={index}
								message={item.text}
							/>
						);
					}

					if (item.categorization) {
						return (
							<CategorizationMessageBalloon
								key={index}
								{...item.categorization}
							/>
						);
					}

					return (
						<AIAssistantMessageBalloon
							error={item.error ?? false}
							feedbackGiven={Boolean(feedbackGiven[index])}
							key={index}
							message={item.text}
							onReport={
								!item.error
									? () =>
											setReportContext({
												agentDefinitionExternalReferenceCodes:
													item.agentDefinitionExternalReferenceCodes ??
													[],
												index,
											})
									: undefined
							}
							onThumbsUp={
								!item.error
									? () => giveThumbsUp(index, item)
									: undefined
							}
						/>
					);
				})}

				{isGenerating && (
					<div className="ai-assistant-chat__generating-balloon">
						<div className="ai-assistant-chat__generating-balloon-indicator">
							<ClayLoadingIndicator />
						</div>

						<span className="ai-assistant-chat__generating-loading-text">
							{Liferay.Language.get('generating')}
						</span>
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>

			{!!quickActions?.length && (
				<div className="ai-assistant-chat__quick-actions">
					<span className="ai-assistant-chat__quick-actions-title">
						{Liferay.Language.get('quick-actions')}
					</span>

					<div className="ai-assistant-chat__quick-actions-list">
						{quickActions.map((quickAction) => (
							<ClayButton
								className="ai-assistant-chat__quick-action"
								disabled={isGenerating}
								displayType="secondary"
								key={quickAction}
								onClick={() => sendMessage(quickAction)}
								size="xs"
							>
								<ClayIcon
									className="ai-assistant-chat__quick-action-icon"
									height={12}
									spritemap={Liferay.Icons.spritemap}
									symbol="stars"
									width={12}
								/>

								{quickAction}
							</ClayButton>
						))}
					</div>
				</div>
			)}

			<ClayForm
				className="ai-assistant-chat__form"
				onSubmit={(event) => onSubmit(event)}
			>
				<div
					className="ai-assistant-chat__input-row"
					data-ai-state={aiState}
				>
					<textarea
						className="ai-assistant-chat__input form-control"
						id="assistant-user-input"
						onChange={(event) => {
							setMessage(event.target.value);
							adjustTextAreaHeight(event.target);
						}}
						onKeyDown={(
							event: React.KeyboardEvent<HTMLTextAreaElement>
						) => {
							handleTextAreaKeyDown(event);
						}}
						placeholder="Ask me anything..."
						readOnly={isGenerating || !!aiState}
						ref={textAreaRef}
						rows={1}
						value={message}
					/>

					<ClayButton
						disabled={!message.trim()}
						displayType="primary"
						type="submit"
					>
						<ClayIcon
							height={12}
							spritemap={Liferay.Icons.spritemap}
							symbol={isGenerating ? 'square' : 'order-arrow-up'}
							width={12}
						/>
					</ClayButton>
				</div>
			</ClayForm>

			<AIAssistantFooterDisclaimer />
		</>
	);
};

export default AIAssistantChatSurface;
