import React from 'react';
import {Col} from "@clayui/layout";
import Task from "./Task";

import './StatusColumn.scss';
import {ITask} from '../../../../../utils/types';
import StateLabel from '../../../../StateLabel';

interface IStatusColumnProps {
    key: string;
    name: string;
    tasks: ITask[];
}

export default function StatusColumn({
    key,
    name,
    tasks,
}: IStatusColumnProps) {

    return (
        <Col>
            <div className='kaban-view__status-column-header'>
                <StateLabel key={key} name={name}/>
                <span>{tasks.length}</span>
            </div>

            <div className="kaban-view__status-column-tasks">
                {tasks.map((task) => {
                    return (<Task {...task} />);
                })}
            </div>
        </Col>
    );
}