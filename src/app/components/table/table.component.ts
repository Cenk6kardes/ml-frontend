import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';

import { TableDataService } from 'src/app/services/table-data.service';
import { BehaviorSubject, take, tap } from 'rxjs';

import {
  AssignedToUserResponse,
  DueDateModel,
  PriorityResponse,
  TableRowItem,
  WorkflowStatusResponse,
} from 'src/app/models/data-models';
import { LazyLoadEvent } from 'primeng/api';
import { EditableColumn } from 'primeng/table';

export interface TableEditEvent {
  field: string;
  data: string;
  index: number;
  originalEvent?: PointerEvent;
}

export interface DropdownChangeEvent {
  originalEvent?: PointerEvent;
  value: string;
}

@Component({
  selector: 'app-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit {
  public minDate = this.getTomorrowDate();
  public data!: TableRowItem[];
  public totalCount!: number;
  public filteredCount!: number;
  public currentPage!: number;
  public pageCount!: number;
  public selectedItemIndex: number = 0;

  @ViewChild(EditableColumn) editableColumn!: EditableColumn;

  public showReCalculateButton = false;
  private _currentItemOriginalData: TableRowItem | undefined = undefined;
  public workFlowStatuses$ = new BehaviorSubject<WorkflowStatusResponse[]>([]);
  public priorities$ = new BehaviorSubject<PriorityResponse[]>([]);
  public assignableUsers!: AssignedToUserResponse[];

  constructor(
    private readonly tableDataService: TableDataService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.tableDataService
      .getData(0, 10)
      .pipe(
        tap((res) => {
          // console.log(res.data.items);
          this.data = this.modifyData(res.data.items);
          this.totalCount = res.data.totalCount;
          this.filteredCount = res.data.filteredCount;
          this.currentPage = res.data.currentPage;
          this.pageCount = res.data.pageCount;
          this.cdRef.detectChanges();
        })
      )
      .subscribe();

    this.tableDataService.getAssignedToUserOptions().subscribe((res) => {
      this.assignableUsers = res;
    });
  }

  loadData(event: LazyLoadEvent) {
    const skip = (event.first || 0) / (event.rows || 10);

    this.tableDataService
      .getData(skip, event.rows)
      .pipe(
        tap((res) => {
          this.data = this.modifyData(res.data.items);
          this.totalCount = res.data.totalCount;
          this.filteredCount = event.rows ? event.rows : res.data.filteredCount;
          this.currentPage = res.data.currentPage;
          this.pageCount = res.data.pageCount;
          this.cdRef.detectChanges();
        })
      )
      .subscribe();
  }

  cellEditStart(e: TableEditEvent): void {
    const currentItem = this.data.find((item) => item.tasksId === e.index);

    if (currentItem!.missingProperties !== null) {
      this.editableColumn.closeEditingCell('missing property exists', e);
      alert("You can't update the record that has a missing property!");

      return;
    }

    this._currentItemOriginalData = { ...currentItem! };
  

    console.log(this._currentItemOriginalData);
    switch (e.field) {
      case 'priority': {
        this.getPriority();
        break;
      }
      case 'workflowStatus': {
        this.getWorkflowStatus();
        break;
      }
      default: {
        console.log(
          '"Due date" and "assigned to" don\'t need dynamic data load'
        );
        break;
      }
    }
  }

  cellEditFinished(e: TableEditEvent): void {
    const currentItemIndex = this.data.findIndex(
      (item) => item.tasksId === e.index
    );

    if (this.showReCalculateButton) {
      this.data[currentItemIndex] = { ...this._currentItemOriginalData! };
      this.showReCalculateButton = false;
      // console.log(this.data);
    }
    console.log(this._currentItemOriginalData);

  }

  getPriority() {
    this.tableDataService
      .getPriorityOptions(this._currentItemOriginalData!.taskTypeId)
      .subscribe((res) => {
        this.priorities$.next(res);
      });
  }

  priorityChanged(e: DropdownChangeEvent, options: any[], row: TableRowItem) {  
    row.priority = options.find((opt) => opt.priorityId === +e.value).name;
    row.priorityId = +e.value;

    this.showReCalculateButton = true;
  }

  blockInput(e: Event) {
    // That prevents keybord input for the due date datepicker
    e.preventDefault();
  }

  dueDateChanged(e: Event, rowItem: TableRowItem): void {
    // rowItem.dueDateModel.dueDate = rowItem.dueDate!;
    console.log(e, rowItem);
    this.showReCalculateButton = true;
  }

  getWorkflowStatus() {
    this.tableDataService
      .getWorkflowStatusOptions(this._currentItemOriginalData!.taskStatusId)
      .subscribe((res) => {
        this.workFlowStatuses$.next(res);
      });
  }

  workflowStatusChanged(
    e: DropdownChangeEvent,
    options: any[],
    row: TableRowItem
  ): void {
    row.workflowStatus = options.find(
      (opt) => opt.workflowStatusId === +e.value
    ).workflowStatus;
    row.workflowStatusId = +e.value;

    this.showReCalculateButton = true;
  }

  assignToUserChanged(
    e: DropdownChangeEvent,
    options: any[],
    row: TableRowItem
  ) {
    row.assignToUser = options.find(
      (opt) => opt.assignedTo === +e.value
    ).assignToUser;
    row.assignedTo = +e.value;

    this.showReCalculateButton = true;
  }

  reCalculateRiskFactor(e: PointerEvent, itemData: TableRowItem): void {
    const itemIndex: number = this.data.findIndex(
      (item) => item.tasksId === itemData.tasksId
    );

    this.tableDataService
      .reCalculateRiskFactor({
        priorityId: itemData?.priorityId || 0,
        entityTypeId: itemData?.entityTypeId || 0,
        taskTypeId: itemData?.taskTypeId || 0,
        taskStatusId: itemData?.taskStatusId || 0,
        jurisdictionId: itemData?.jurisdictionId || 0,
        workflowStatusId: itemData?.workflowStatusId || 0,
        assignedTo: itemData?.assignedTo || 0,
        dueDate: itemData?.dueDate || '',
        createdDate: itemData?.createdDate || '',
      })
      .pipe(take(1))
      .subscribe((newData: DueDateModel) => {
        this.data[itemIndex].dueDateModel = {
          ...newData,
          dueDate: newData.dueDate
            ? newData.dueDate.split('T')[0]
            : newData.dueDate,
        };

        this.showReCalculateButton = false;
        this.editableColumn.closeEditingCell('re-calculation done', e);
        // console.log('Success', this.data);

        this.cdRef.detectChanges();
      });
  }

  private modifyData(data: TableRowItem[]): TableRowItem[] {
    return data.map((item: TableRowItem) => {
      return {
        ...item,
        dueDate: item.dueDate ? item.dueDate.split('T')[0] : item.dueDate,
        modifiedDate: item.modifiedDate
          ? item.modifiedDate.split('T')[0]
          : item.modifiedDate,
        createdDate: item.createdDate
          ? item.createdDate.split('T')[0]
          : item.createdDate,
        dueDateModel: {
          ...item.dueDateModel,
          color: item.dueDate ? item.dueDateModel.color : 'Transparent',
        },
      };
    });
  }

  private getTomorrowDate(): string {
    const today = new Date();
    // tomorrow.setDate(tomorrow.getDate() + 1);
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();

    return `${year}-${month < 10 ? '0' + month : month}-${
      date < 10 ? '0' + date : date
    }`;
  }
}
