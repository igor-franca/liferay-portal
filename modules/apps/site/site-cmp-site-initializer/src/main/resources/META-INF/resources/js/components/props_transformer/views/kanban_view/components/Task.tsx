import React from 'react';
import ClayCard, {ClayCardWithInfo} from "@clayui/card";
import ClayLayout from "@clayui/layout";
import ClayLabel from "@clayui/label";
import {ClayDropDownWithItems} from "@clayui/drop-down";
import {type ButtonWithIconProps, ClayButtonWithIcon} from "@clayui/button";
import {Provider} from "@clayui/provider";
import Card from '@clayui/card/src/Card';
import Label from '@clayui/label';
import {ITask} from '../../../../../utils/types';
import { mapLabelToLabelDisplayType } from '../../../../../utils/constants';

export default function Task(props: ITask) {
    const ariaLabel = '';

    const dropDownTriggerProps = {
        'aria-label': 'More actions',
    };

    const labels: any[] = [];

    const spritemap = '/public/icons.svg';

    const description = 'some description';
    const title = 'some title';

    return (
          <Card>
            <Card.Body>
              <Card.Row>
                <div className="autofit-col autofit-col-expand">
                  <section className="autofit-section">
                    <Card.Description displayType="title">
                      {props.embedded.title}
                    </Card.Description>
                    <Card.Description displayType="subtitle">
                      {props.embedded.cmpProjectToCMPTasks.title}
                    </Card.Description>
                    <Card.Caption>
                      <Label displayType={mapLabelToLabelDisplayType[props.embedded.state.name]}>{props.embedded.state.name}</Label>
                    </Card.Caption>
                  </section>
                </div>
              </Card.Row>
            </Card.Body>
          </Card>
    )

}