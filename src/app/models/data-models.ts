export interface PageInfo {
  skip: number;
  take: number;
}

export interface Response<T> {
  message: string;
  data: T;
  validationErrors: any[];
  hasError: boolean;
}

export interface PagedResponse<T> {
  message: string;
  data: {
    totalCount: number;
    filteredCount: number;
    currentPage: number;
    pageCount: number;
    items: T;
  };
  validationErrors: any[];
  hasError: boolean;
}

export interface TableRowItem {
  tasksId: number;
  priority: string;
  priorityId: number | null;
  title: string;
  taxYear: number | null;
  dueDate: string | null;
  dueDateModel: DueDateModel;
  taskType: string;
  taskTypeId: number;
  category: string;
  taskCategoryId: number | null;
  taskStatus: string;
  taskStatusId: number;
  jurisdiction: string;
  jurisdictionId: number | null;
  assignToUser: string;
  assignedTo: number | null;
  createdDate: string;
  createdBy: number;
  createdByUser: string;
  modifiedDate: string | null;
  modifiedBy: number | null;
  modifiedByUser: string;
  status: string;
  statusID: number;
  entityTypeId: number | null;
  entityType: string;
  workflowStatusId: number | null;
  workflowStatus: string;
  taxAuthority: string;
  daysSupposedToBeFinished: number | null;
  missingProperties: string[] | null;
}
// PriorityId	TaskStatusId	JurisdictionId	AssignedTo	EntityTypeId	WorkflowStatusId	DaysSupposedToBeFinished
export interface PredictDataModel {
  priorityId: number;
  taskTypeId: number;
  taskStatusId: number;
  jurisdictionId: number;
  assignedTo: number;
  entityTypeId: number;
  workflowStatusId: number;
  dueDate: string;
  createdDate: string;
}

export enum Priority {
  Normal = 'Normal',
}

export interface DueDateModel {
  dueDate: string;
  color: string;
  riskFactor: boolean | null;
  algorithm?: string;
}

export interface AssignedToUserResponse {
  id: number;
  name: string;
}

export interface WorkflowStatusResponse {
  workflowStatusId: number;
  workflowStatus: string;
  taskStatusId: number;
  taskCategoryId: number;
}

export interface PriorityResponse {
  priorityId: number;
  name: string;
  taskTypeId: number;
}

// export type TaskStatus = "Status Unavailable In OTT" | "Completed" | "N/A - Should not be included in reporting" | "Waiting for Information" | "Client Reviewing Return";

/* export enum Color {
  The34C768 = "#34c768",
}

export enum Status {
  Active = "Active",
}

export enum TaskStatus {
  ClientReviewingReturn = "Client Reviewing Return",
  Completed = "Completed",
  NAShouldNotBeIncludedInReporting = "N/A - Should not be included in reporting",
  StatusUnavailableInOTT = "Status Unavailable In OTT",
  WaitingForInformation = "Waiting for Information",
} */
