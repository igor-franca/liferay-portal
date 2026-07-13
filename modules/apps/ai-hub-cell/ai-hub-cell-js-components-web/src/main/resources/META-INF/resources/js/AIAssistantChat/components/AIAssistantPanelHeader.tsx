/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import ClayLayout from '@clayui/layout';
import React from 'react';

interface AIAssistantPanelHeaderProps {
	onClose: () => void;
}

const AIAssistantPanelHeader: React.FC<AIAssistantPanelHeaderProps> = ({
	onClose,
}) => {
	return (
		<div className="ai-assistant-chat__panel-header">
			<ClayLayout.ContentRow className="ai-assistant-chat__panel-header-row">
				<ClayLayout.ContentCol className="ai-assistant-chat__panel-title">
					{Liferay.Language.get('ai-assistant')}
				</ClayLayout.ContentCol>

				<ClayLayout.ContentCol>
					<ClayButton
						aria-label={Liferay.Language.get('close')}
						borderless
						displayType="unstyled"
						onClick={onClose}
					>
						<ClayIcon
							className="ai-assistant-chat__panel-close-button"
							spritemap={Liferay.Icons.spritemap}
							symbol="times"
						/>
					</ClayButton>
				</ClayLayout.ContentCol>
			</ClayLayout.ContentRow>
		</div>
	);
};

export default AIAssistantPanelHeader;
