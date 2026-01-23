import React, {useContext} from 'react';
import {KanbanViewContext} from "../context";
import {ContainerFluid} from "@clayui/layout";
import StatusColumn from "./StatusColumn";

export default function Board() {
    const {changeTaskStatus, boardData} = useContext(KanbanViewContext);

    return (
        <ContainerFluid>
            <div className="d-flex">
                {(Object.keys(boardData))
                    .sort((a, b) => (parseInt(a, 10) - parseInt(b, 10)))
                    .map((state) => {
                        return (
                            <StatusColumn key={state} name={boardData[state].name} tasks={boardData[state].tasks} />
                        );
                    })
                }
            </div>
        </ContainerFluid>
    );
}