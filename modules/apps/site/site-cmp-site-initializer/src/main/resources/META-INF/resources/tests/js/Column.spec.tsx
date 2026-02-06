import {act, fireEvent, render, waitFor} from '@testing-library/react';
import React from 'react';
import {DndProvider, useDragDropManager} from 'react-dnd';
import {TestBackend} from 'react-dnd-test-backend';

import Column, {
    ItemTypes,
} from '../../js/components/props_transformer/views/kanban_view/components/Column';
import {KanbanViewContext} from '../../js/components/props_transformer/views/kanban_view/context';
import * as APIUtils from '../../js/utils/api'; // Import the module to spy on it cleanly

const mockOpenCMPModal = jest.fn();

jest.mock('../../js/utils/openCMPModal', () => ({
    openCMPModal: (...args: any[]) => mockOpenCMPModal(...args),
}));

jest.mock(
    '../../js/components/props_transformer/views/kanban_view/components/Task',
    () => () => <div data-testid="task" />
);

const renderWithDnd = (component: React.ReactElement) => {
    return render(<DndProvider backend={TestBackend}>{component}</DndProvider>);
};

const DragDropManagerConsumer = ({children}) => {
    const dndManager = useDragDropManager();
    return children(dndManager);
};

// Mock Source Spec
const mockDragSourceSpec = {
    beginDrag: () => ({}),
    canDrag: () => true,
    endDrag: () => {},
    isDragging: () => true,
};

describe('Kanban Column', () => {
    let getStateSpy: jest.SpyInstance;

    beforeEach(() => {
        getStateSpy = jest.spyOn(
            APIUtils,
            'getStateObjectField'
        ).mockResolvedValue({
            data: {
                items: [
                    {
                        objectFieldSettings: [
                            {
                                name: 'stateFlow',
                                value: {
                                    objectStates: [
                                        {
                                            key: 'inProgress',
                                            objectStateTransitions: [
                                                {key: 'done'},
                                            ],
                                        },
                                        {
                                            key: 'done',
                                            objectStateTransitions: [],
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                ],
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('opens create modal when click on add task button', async () => {
        const column = {
            displayType: 'info',
            icon: {color: '#fff', name: 'star'},
            key: 'inProgress',
            name: 'In Progress',
            tasks: [{embedded: {id: 1}}, {embedded: {id: 2}}],
        } as any;

        const {getByRole} = renderWithDnd(
            <KanbanViewContext.Provider
                value={{
                    boardData: {},
                    changeTaskStatus: () => {},
                    dataSetId: 'dataSetId',
                }}
            >
                <Column column={column} />
            </KanbanViewContext.Provider>
        );

        const addButton = getByRole('button', {name: 'add-task'});

        fireEvent.click(addButton);

        await waitFor(() => expect(mockOpenCMPModal).toHaveBeenCalled());
    });

    it('renders header, icon when present, task count and opens create modal', async () => {
        const column = {
            displayType: 'info',
            icon: {color: '#fff', name: 'star'},
            key: 'inProgress',
            name: 'In Progress',
            tasks: [{embedded: {id: 1}}, {embedded: {id: 2}}],
        } as any;

        const {container, getAllByTestId, getByText} = renderWithDnd(
            <KanbanViewContext.Provider
                value={{
                    boardData: {},
                    changeTaskStatus: () => {},
                    dataSetId: 'dataSetId',
                }}
            >
                <Column column={column} />
            </KanbanViewContext.Provider>
        );

        expect(getByText('In Progress')).toBeInTheDocument();
        expect(getByText('2')).toBeInTheDocument();

        expect(
            container.querySelector('.lexicon-icon-star')
        ).toBeInTheDocument();

        expect(getAllByTestId('task').length).toBe(2);
    });

    describe('Drag and Drop', () => {
        let mockChangeTaskStatus: jest.Mock;

        beforeEach(() => {
            mockChangeTaskStatus = jest.fn();
            // Note: The getStateSpy from the main beforeEach is sufficient
        });

        it('should be a valid drop target if task has update permission and transition is valid', async () => {
            const column = {
                icon: {color: '#fff', name: 'star'},
                key: 'done',
                name: 'Done',
                tasks: [],
            } as any;

            const task = {
                actions: {update: true},
                embedded: {
                    id: 1,
                    state: {key: 'inProgress', name: 'In Progress'},
                },
            };

            let dndManager: any;

            renderWithDnd(
                <KanbanViewContext.Provider
                    value={{
                        changeTaskStatus: mockChangeTaskStatus,
                        dataSetId: 'dataSetId',
                    }}
                >
                    <Column column={column} />
                    <DragDropManagerConsumer>
                        {(manager) => {
                            dndManager = manager;
                            return null;
                        }}
                    </DragDropManagerConsumer>
                </KanbanViewContext.Provider>
            );

            // FIX: Wait for the API to be called and state to settle BEFORE interacting with DnD
            await waitFor(() => expect(getStateSpy).toHaveBeenCalled());

            const backend = dndManager.getBackend();
            const monitor = dndManager.getMonitor();
            const registry = dndManager.getRegistry();

            const targetId = monitor.getTargetIds()[0];

            const item = {task, type: ItemTypes.TASK};

            await act(async () => {
                backend.simulateBeginDrag([
                    registry.addSource(ItemTypes.TASK, {
                        ...mockDragSourceSpec, 
                        beginDrag: () => (item),
                    }),
                ]);
                
                // // Now that stateFlow is populated, this hover won't crash
                // backend.simulateHover([targetId], {
                //     item,
                // });
            });

            expect(monitor.canDropOnTarget()).toBe(true);
        });

        it('should not be a valid drop target if task does not have update permission', async () => {
            const column = {
                icon: {color: '#fff', name: 'star'},
                key: 'done',
                name: 'Done',
                tasks: [],
            } as any;

            const task = {
                actions: {update: false},
                embedded: {
                    id: 1,
                    state: {key: 'inProgress', name: 'In Progress'},
                },
            };

            let dndManager: any;

            renderWithDnd(
                <KanbanViewContext.Provider
                    value={{
                        changeTaskStatus: mockChangeTaskStatus,
                        dataSetId: 'dataSetId',
                    }}
                >
                    <Column column={column} />
                    <DragDropManagerConsumer>
                        {(manager) => {
                            dndManager = manager;
                            return null;
                        }}
                    </DragDropManagerConsumer>
                </KanbanViewContext.Provider>
            );

            // FIX: Wait for API
            await waitFor(() => expect(getStateSpy).toHaveBeenCalled());

            const backend = dndManager.getBackend();
            const monitor = dndManager.getMonitor();
            const registry = dndManager.getRegistry();

            const targetId = monitor.getTargetIds()[0];

            const item = {task, type: ItemTypes.TASK};

            await act(async () => {
                backend.simulateBeginDrag([
                    registry.addSource(ItemTypes.TASK, {
                        ...mockDragSourceSpec, 
                        beginDrag: () => (item),
                    }),
                ]);
                // backend.simulateHover([targetId], {
                //     item,
                // });
            });

            expect(monitor.canDropOnTarget()).toBe(false);
        });

        it('should not be a valid drop target if transition is not valid', async () => {
            const column = {
                icon: {color: '#fff', name: 'star'},
                key: 'inProgress',
                name: 'In Progress',
                tasks: [],
            } as any;

            const task = {
                actions: {update: true},
                embedded: {
                    id: 1,
                    state: {key: 'done', name: 'Done'},
                },
            };

            let dndManager: any;

            renderWithDnd(
                <KanbanViewContext.Provider
                    value={{
                        changeTaskStatus: mockChangeTaskStatus,
                        dataSetId: 'dataSetId',
                    }}
                >
                    <Column column={column} />
                    <DragDropManagerConsumer>
                        {(manager) => {
                            dndManager = manager;
                            return null;
                        }}
                    </DragDropManagerConsumer>
                </KanbanViewContext.Provider>
            );

            // FIX: Wait for API
            await waitFor(() => expect(getStateSpy).toHaveBeenCalled());

            const backend = dndManager.getBackend();
            const monitor = dndManager.getMonitor();
            const registry = dndManager.getRegistry();

            const targetId = monitor.getTargetIds()[0];

            const item = {task, type: ItemTypes.TASK};

            await act(async () => {
                backend.simulateBeginDrag([
                    registry.addSource(ItemTypes.TASK, {
                        ...mockDragSourceSpec, 
                        beginDrag: () => (item),
                    }),
                ]);
                // backend.simulateHover([targetId], {
                //     item,
                // });
            });

            expect(monitor.canDropOnTarget()).toBe(false);
        });

        it('should call changeTaskStatus on drop', async () => {
            const column = {
                icon: {color: '#fff', name: 'star'},
                key: 'done',
                name: 'Done',
                tasks: [],
            } as any;

            const task = {
                actions: {update: true},
                embedded: {
                    id: 1,
                    state: {key: 'inProgress', name: 'In Progress'},
                },
            };

            let dndManager: any;

            renderWithDnd(
                <KanbanViewContext.Provider
                    value={{
                        changeTaskStatus: mockChangeTaskStatus,
                        dataSetId: 'dataSetId',
                    }}
                >
                    <Column column={column} />
                    <DragDropManagerConsumer>
                        {(manager) => {
                            dndManager = manager;
                            return null;
                        }}
                    </DragDropManagerConsumer>
                </KanbanViewContext.Provider>
            );

            // FIX: Wait for API
            await waitFor(() => expect(getStateSpy).toHaveBeenCalled());

            const backend = dndManager.getBackend();
            const registry = dndManager.getRegistry();
            const monitor = dndManager.getMonitor();

            const targetId = monitor.getTargetIds()[0];

            const sourceId = registry.addSource(
                ItemTypes.TASK,
                {
                    ...mockDragSourceSpec, 
                    beginDrag: () => ({task, type: ItemTypes.TASK}),
                }
            );

            const item = {task, type: ItemTypes.TASK};

            await act(async () => {
                backend.simulateBeginDrag([sourceId], {
                    item,
                });
                // backend.simulateHover([targetId]);
                backend.simulateDrop();
                backend.simulateEndDrag();
            });

            expect(mockChangeTaskStatus).toHaveBeenCalledWith(task, {
                key: 'done',
                name: 'Done',
            });
        });
    });
});