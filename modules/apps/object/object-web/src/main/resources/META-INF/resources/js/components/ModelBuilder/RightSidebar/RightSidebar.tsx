import { CustomVerticalBar } from "@liferay/object-js-components-web";
import ClayEmptyState from '@clayui/empty-state';
import React from "react";

import './RightSidebar.scss';

export default function RightSideBar({}) {
    return (
        <CustomVerticalBar
            defaultActive="objectsModelBuilderRightSidebar"
            panelWidth={280}
            panelWidthMax={280}
            panelWidthMin={280}
            position="right"
            resize={false}
            triggerSideBarAnimation={true}
            verticalBarItems={[
                {
                    title: 'objectsModelBuilderRightSidebar',
                },
            ]}
        >
            <div className="lfr-objects__model-builder-right-sidebar">
                <ClayEmptyState
                    description={Liferay.Language.get(
                        'select-an-object-or-relationship-to-activate-this-panel'
                    )}
                    imgSrc={`${Liferay.ThemeDisplay.getPathThemeImages()}/states/empty_state.gif`}
                    small
                    title={Liferay.Language.get('select-an-object-or-relationship')}
                />
            </div>

        </CustomVerticalBar>
    )
}