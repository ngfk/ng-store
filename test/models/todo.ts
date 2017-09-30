export interface Todo {
    readonly id: number;
    readonly text: string;
    readonly completed: boolean;
}

export interface TodoActionMap {
    TODO_ADD: string;
    TODO_DELETE: number;
    TODO_EDIT: { id: number; text: string };
    TODO_COMPLETE: number;
    TODO_COMPLETE_ALL: undefined;
    TODO_CLEAR: undefined;
}
