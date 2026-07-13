/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {EventSource} from 'eventsource';
import {useCallback, useEffect, useRef, useState} from 'react';

import {
	CATEGORIZE_EVENT,
	CategorizeEventPayload,
} from '../Categorization/events';
import {ECategorizationAgent} from '../Categorization/types';
import submitPositiveReportFeedback from '../ReportFeedback/submitPositiveReportFeedback';
import {
	ChatContext,
	createEventSource,
	postChatByExternalReferenceCodeMessage,
} from './api';

export interface AIChatMessage {
	agentDefinitionExternalReferenceCodes?: string[];
	categorization?: CategorizeEventPayload;
	error?: boolean;
	sender: string;
	text: string;
}

export interface AIChatReportContext {
	agentDefinitionExternalReferenceCodes: string[];
	index: number;
}

export interface AIChat {
	feedbackGiven: Record<number, boolean>;
	giveThumbsUp: (index: number, item: AIChatMessage) => void;
	isGenerating: boolean;
	markFeedbackGiven: (index: number) => void;
	message: string;
	messages: AIChatMessage[];
	messagesEndRef: React.RefObject<HTMLDivElement>;
	reportContext: AIChatReportContext | null;
	sendMessage: (text: string) => void;
	setMessage: (message: string) => void;
	setReportContext: (reportContext: AIChatReportContext | null) => void;
}

interface UseAIChatProps {
	context?: ChatContext;
	getContext?: () => ChatContext;
	initialMessage?: string;
	instructionDefinitionScope: string;
	onOpenRequested?: () => void;
}

export default function useAIChat({
	context,
	getContext,
	initialMessage,
	instructionDefinitionScope,
	onOpenRequested,
}: UseAIChatProps): AIChat {
	const [feedbackGiven, setFeedbackGiven] = useState<Record<number, boolean>>(
		{}
	);
	const [isGenerating, setIsGenerating] = useState<boolean>(false);
	const [messages, setMessages] = useState<AIChatMessage[]>([]);
	const [message, setMessage] = useState<string>('');
	const [reportContext, setReportContext] =
		useState<AIChatReportContext | null>(null);

	const eventSourceRef = useRef<EventSource | null>(null);
	const eventSourceReference = useRef<string | null>(null);
	const contextRef = useRef<ChatContext | undefined>(context);
	const getContextRef = useRef<(() => ChatContext) | undefined>(getContext);
	const initialMessageRef = useRef<string | undefined>(initialMessage);
	const initialMessageSentRef = useRef<boolean>(false);
	const instructionDefinitionScopeRef = useRef<string>(
		instructionDefinitionScope
	);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const onOpenRequestedRef = useRef<(() => void) | undefined>(
		onOpenRequested
	);

	useEffect(() => {
		contextRef.current = context;
		getContextRef.current = getContext;
		instructionDefinitionScopeRef.current = instructionDefinitionScope;
		onOpenRequestedRef.current = onOpenRequested;
	}, [context, getContext, instructionDefinitionScope, onOpenRequested]);

	const giveThumbsUp = useCallback(
		(index: number, item: AIChatMessage) => {
			if (feedbackGiven[index]) {
				return;
			}

			setFeedbackGiven((previousFeedbackGiven) => ({
				...previousFeedbackGiven,
				[index]: true,
			}));

			submitPositiveReportFeedback({
				agentDefinitionExternalReferenceCodes:
					item.agentDefinitionExternalReferenceCodes ?? [],
				surface: 'aiAssistant',
			});
		},
		[feedbackGiven]
	);

	const markFeedbackGiven = useCallback((index: number) => {
		setFeedbackGiven((previousFeedbackGiven) => ({
			...previousFeedbackGiven,
			[index]: true,
		}));
	}, []);

	const sendMessage = useCallback((text: string) => {
		if (!text.trim()) {
			return;
		}

		setMessages((previousMessages) => {
			setTimeout(() => {
				messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
			}, 0);

			return [...previousMessages, {sender: 'user', text}];
		});

		setMessage('');

		if (eventSourceReference.current) {
			setIsGenerating(true);

			const getCurrentContext =
				getContextRef.current ?? (() => contextRef.current ?? {});

			postChatByExternalReferenceCodeMessage({
				chatContext: getCurrentContext(),
				eventSourceReference: eventSourceReference.current,
				instructionDefinitionScope:
					instructionDefinitionScopeRef.current,
				message: text,
			}).catch(() => setIsGenerating(false));
		}
	}, []);

	const openAIAssistantChatConnection = useCallback(() => {
		createEventSource().then((eventSource) => {
			if (!eventSource) {
				return;
			}

			eventSourceRef.current = eventSource;

			eventSourceRef.current.addEventListener(
				'Chat Message Sent',
				(event) => {
					try {
						const dataJSON = JSON.parse(event.data);

						setMessages((previousMessages) => {
							setTimeout(() => {
								messagesEndRef.current?.scrollIntoView({
									behavior: 'smooth',
								});
							}, 0);

							return [
								...previousMessages,
								{
									agentDefinitionExternalReferenceCodes:
										dataJSON[
											'agentDefinitionExternalReferenceCodes'
										] ?? [],
									sender: 'assistant',
									text: dataJSON['data'],
								},
							];
						});

						setMessage('');
					}
					catch {
						setMessages((previousMessages) => [
							...previousMessages,
							{error: true, sender: 'assistant', text: ''},
						]);
					}

					setIsGenerating(false);
				}
			);

			eventSourceRef.current.addEventListener('Subscribe', (event) => {
				eventSourceReference.current = event.data;

				if (
					initialMessageRef.current &&
					!initialMessageSentRef.current
				) {
					initialMessageSentRef.current = true;

					sendMessage(initialMessageRef.current);
				}
			});

			eventSourceRef.current.addEventListener(
				'Agent Invocation Failed',
				(event) => {
					let text = '';

					try {
						text = JSON.parse(event.data)['data'];
					}
					catch {
						text = '';
					}

					setMessages((previousMessages) => {
						setTimeout(() => {
							messagesEndRef.current?.scrollIntoView({
								behavior: 'smooth',
							});
						}, 0);

						return [
							...previousMessages,
							{
								error: true,
								sender: 'assistant',
								text,
							},
						];
					});

					setIsGenerating(false);
				}
			);
		});
	}, [sendMessage]);

	const closeAIAssistantChatConnection = useCallback(() => {
		eventSourceRef.current?.close();

		eventSourceRef.current = null;
	}, []);

	useEffect(() => {
		openAIAssistantChatConnection();

		return () => {
			closeAIAssistantChatConnection();
		};
	}, [closeAIAssistantChatConnection, openAIAssistantChatConnection]);

	useEffect(() => {
		const handleCategorize = (payload: CategorizeEventPayload) => {
			onOpenRequestedRef.current?.();

			setMessages((previousMessages) => {
				setTimeout(() => {
					messagesEndRef.current?.scrollIntoView({
						behavior: 'smooth',
					});
				}, 0);

				return [
					...previousMessages,
					{
						sender: 'user',
						text:
							payload.agent ===
							ECategorizationAgent.AUTO_CATEGORIZE
								? Liferay.Language.get('add-categories')
								: Liferay.Language.get('generate-tags'),
					},
					{categorization: payload, sender: 'assistant', text: ''},
				];
			});
		};

		Liferay.on(CATEGORIZE_EVENT, handleCategorize);

		return () => {
			Liferay.detach(CATEGORIZE_EVENT, handleCategorize);
		};
	}, []);

	return {
		feedbackGiven,
		giveThumbsUp,
		isGenerating,
		markFeedbackGiven,
		message,
		messages,
		messagesEndRef,
		reportContext,
		sendMessage,
		setMessage,
		setReportContext,
	};
}
