import { DoBootstrap, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { AppComponent } from './app.component';
import { TableComponent } from './components/table/table.component';
import { PredictComparisonComponent } from './components/predict-comparison/predict-comparison.component';

@NgModule({
  declarations: [AppComponent, TableComponent, PredictComparisonComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    CardModule,
    TableModule,
    BadgeModule,
    TooltipModule,
    DropdownModule,
    ButtonModule,
    RippleModule,
  ],
  entryComponents: [TableComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const webComponent = createCustomElement(TableComponent, {
      injector: this.injector,
    });
    customElements.define('share-trust-table', webComponent);
  }
}
