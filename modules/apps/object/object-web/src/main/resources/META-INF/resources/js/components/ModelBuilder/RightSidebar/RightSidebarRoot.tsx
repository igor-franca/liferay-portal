import { CustomVerticalBar } from "@liferay/object-js-components-web";
import React, {ReactNode} from "react";

import './RightSidebarRoot.scss';

interface IRightSidebarRoot {
    children: ReactNode;
}

export function RightSideBarRoot({
    children
} : IRightSidebarRoot) {
    return (
        <CustomVerticalBar
            defaultActive="objectsModelBuilderRightSidebar"
            panelWidth={320}
            position="right"
            resize={false}
            triggerSideBarAnimation={true}
            verticalBarItems={[
                {
                    title: 'objectsModelBuilderRightSidebar',
                },
            ]}
        >

            {children}

        </CustomVerticalBar>    
    )
}