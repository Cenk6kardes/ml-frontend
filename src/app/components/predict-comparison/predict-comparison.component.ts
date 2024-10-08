import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TableDataService } from 'src/app/services/table-data.service';

@Component({
  selector: 'app-predict-comparison',
  templateUrl: 'predict-comparison.component.html',
  styleUrls: ['predict-comparison.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredictComparisonComponent {
  constructor(public readonly tableDataService: TableDataService) {}
}
