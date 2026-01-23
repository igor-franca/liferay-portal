import React, {useCallback, useState} from 'react';

import {KanbanViewContext} from './context';
import Board from "./components/Board";
import {IColumn, ITask} from '../../../../utils/types';

interface KanbanViewProps {
    [k: string]: ITask[];
}

function mapByStatusCode(items: ITask[]) {
    return items.reduce(
        (column: {[k: string]: IColumn}, item: ITask) => {
            const {state: {key: stateKey, name: stateName}} = item.embedded;

            if (!column[stateKey]?.tasks?.length) {
                column[stateKey] = {
                    key: stateKey,
                    name: stateName,
                    tasks: [],
                }
            }

            column[stateKey].tasks.push(item);

            return {...column};
        }, {});
}

function KanbanView(props: KanbanViewProps) {
    const [boardData, setBoardData] = useState(mapByStatusCode(props.items));

    const changeTaskStatus = useCallback(() => {}, [boardData]);

    return (
            <KanbanViewContext.Provider value={{
                changeTaskStatus,
                boardData
            }}>
                <Board />
            </KanbanViewContext.Provider>
    );
}

export default KanbanView;