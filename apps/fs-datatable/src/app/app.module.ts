import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { DataTableModule } from '@demo/data-table';

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, DataTableModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
