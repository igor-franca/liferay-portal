import React from "react";
import ClayEmptyState from '@clayui/empty-state';

export function RightSidebarEmpty() {
    return (
        <div className="lfr-objects__model-builder-right-sidebar-empty-state">
            <ClayEmptyState
                description={Liferay.Language.get(
                    'select-an-object-or-relationship-to-activate-this-panel'
                )}
                imgSrc={`${Liferay.ThemeDisplay.getPathThemeImages()}/states/empty_state.gif`}
                small
                title={Liferay.Language.get('select-an-object-or-relationship')}
            />
        </div>
    )
}