import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, map, take, tap } from 'rxjs';

import {
  DueDateModel,
  PredictDataModel,
  PagedResponse,
  Response,
  TableRowItem,
  AssignedToUserResponse,
  WorkflowStatusResponse,
  PriorityResponse,
} from '../models/data-models';

@Injectable({ providedIn: 'root' })
export class TableDataService {
  private _endpointURL = 'http://localhost:7091/api';

  private _lastCalculatedRiskData: DueDateModel[] = [];
  private lastCalculatedRiskData$$ = new BehaviorSubject<DueDateModel[]>(
    this._lastCalculatedRiskData
  );
  public lastCalculatedRiskData$: Observable<DueDateModel[]>;

  constructor(private httpClient: HttpClient) {
    this.lastCalculatedRiskData$ = this.lastCalculatedRiskData$$.asObservable();
  }

  getData(
    skip = 0,
    take = 10,
    sortByDueDate = false
  ): Observable<PagedResponse<TableRowItem[]>> {
    const options = {
      params: {
        ['Skip']: skip,
        ['Take']: take,
      },
    };

    return this.httpClient.get<PagedResponse<TableRowItem[]>>(
      this._endpointURL + '/get',
      options
    );
  }

  reCalculateRiskFactor(data: PredictDataModel): Observable<DueDateModel> {
    return this.httpClient
      .post<Response<DueDateModel>>(this._endpointURL + '/predict', data)
      .pipe(
        tap((response: Response<DueDateModel>) => {
          response.validationErrors.length > 0
            ? alert(response.validationErrors[0].value)
            : this.lastCalculatedRiskData$$.next([response.data]);
        }),
        map((response) => response.data)
      );
  }

  getAssignedToUserOptions(): Observable<AssignedToUserResponse[]> {
    return this.httpClient
      .get<Response<AssignedToUserResponse[]>>(
        this._endpointURL + '/get-assign-to'
      )
      .pipe(
        take(1),
        tap((response: Response<AssignedToUserResponse[]>) => {
          if (response.validationErrors.length > 0) {
            alert(response.validationErrors[0].value);
          }
        }),
        map((response) => response.data)
      );
  }

  getWorkflowStatusOptions(
    statusId: number
  ): Observable<WorkflowStatusResponse[]> {
    return this.httpClient
      .get<Response<WorkflowStatusResponse[]>>(
        this._endpointURL + '/workflow-status-by-id?TaskStatusId=' + statusId
      )
      .pipe(
        take(1),
        tap((response: Response<WorkflowStatusResponse[]>) => {
          if (response.validationErrors.length > 0) {
            alert(response.validationErrors[0].value);
          }
        }),
        map((response) => response.data)
      );
  }

  getPriorityOptions(taskTypeId: number): Observable<PriorityResponse[]> {
    return this.httpClient
      .get<Response<PriorityResponse[]>>(
        this._endpointURL + `/priority-by-id?TaskTypeId=${taskTypeId}`
      )
      .pipe(
        take(1),
        tap((response: Response<PriorityResponse[]>) => {
          if (response.validationErrors.length > 0) {
            alert(response.validationErrors[0].value);
          }
        }),
        map((response) => response.data)
      );
  }
}
