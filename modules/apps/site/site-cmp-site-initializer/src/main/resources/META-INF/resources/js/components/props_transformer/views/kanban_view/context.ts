import React from 'react';
import {IColumn, IKanbanState} from '../../../../utils/types';

interface IKanbanContext {
  boardData: {[k: string]: IColumn};
  changeTaskStatus: React.Dispatch<React.SetStateAction<IKanbanState>>;
}

export const KanbanViewContext = React.createContext({} as IKanbanContext);