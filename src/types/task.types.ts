export interface TaskDataInterface {
    userId: string;
    title: string;
    completed: boolean;
    createdAt: string;
    readonly id: string;
    readonly updatedAt: string;
}

export type TaskListType = TaskDataInterface[]