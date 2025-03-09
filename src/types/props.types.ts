import { Dispatch, SetStateAction } from "react";
import { TaskDataInterface, TaskListType } from "./task.types";
import { LoginStepsType } from "./login.types";
import { NotificationAlertSeverityType } from "./misc.types";

export interface AddTaskPropsInterface {
    taskTitle: string,
    setTaskTitle: Dispatch<SetStateAction<string>>,
    taskList: TaskListType,
    setTaskList: Dispatch<SetStateAction<TaskListType>>
}

export interface ConfirmSignupFormPropsInterface {
    emailForConfirmation: string,
    setloginPageStep: Dispatch<SetStateAction<LoginStepsType>>
}

export interface NotificationAlertPropsInterface {
    severity: NotificationAlertSeverityType,
    message: string,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

export interface SignupFormPropsInterface {
    setloginPageStep: Dispatch<SetStateAction<LoginStepsType>>,
    setEmailForConfirmation: Dispatch<SetStateAction<string>>
}

export interface TaskCardPropsInterface {
    taskData: TaskDataInterface,
    setTaskList: Dispatch<SetStateAction<TaskListType>>
}

export interface TaskListPropsInterface {
    taskList: TaskListType,
    setTaskList: Dispatch<SetStateAction<TaskListType>>
}