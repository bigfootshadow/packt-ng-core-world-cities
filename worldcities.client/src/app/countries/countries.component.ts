import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { environment } from '../../environments/environment';

import { Country } from './country'


@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss'
})
export class CountriesComponent implements OnInit {

  public displayedColumns: string[] = ['id', 'name', 'iso2', 'iso3'];
  public countries!: MatTableDataSource<Country>;
  public defaultPageIndex: number = 1;
  public defaultPageSize: number = 10;
  public defaultSortColumn: string = "name";
  public defaultSortOrder: "asc" | "desc" = "asc";

  public defaultFilterColumn: string = "name";
  public filterQuery?: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(query? :string){
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.filterQuery = query;
    this.getData(pageEvent);
  }

  getData(event: PageEvent) {
    const url = environment.baseUrl + 'api/Countries';

    let params = new HttpParams()
      .set('pageIndex', event.pageIndex)
      .set('pageSize', event.pageSize)
      .set("sortColumn", (this.sort)
        ? this.sort.active
        : this.defaultSortColumn)
      .set('sortOrder', (this.sort)
        ? this.sort.direction
        : this.defaultSortOrder);

    if (this.filterQuery) {
      params = params
        .set("filterColumn", this.defaultFilterColumn)
        .set("filterQuery", this.filterQuery);
    }

    this.http.get<any>(url, {params})
      .subscribe({
        next: response => {
          this.paginator.length = response.totalCount;
          this.paginator.pageIndex = response.pageIndex;
          this.paginator.pageSize = response.pageSize;
          this.countries = new MatTableDataSource(response.data);
        },
        error: error => console.error(error)
      });
  }
}
