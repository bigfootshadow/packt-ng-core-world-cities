import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { environment } from '../../environments/environment';

import { City } from './City';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.scss'
})
export class CitiesComponent implements OnInit {

  public displayedColumns: string[] = ['id', 'name', 'lon', 'lat'];
  public cities!: MatTableDataSource<City>;
  public defaultPageIndex: number = 1;
  public defaultPageSize: number = 10;
  public defaultSortColumn: string = "name";
  public defaultSortOrder: "asc" | "desc" = "asc";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.getData(pageEvent);
  }

  getData(event: PageEvent){
    const url = environment.baseUrl + 'api/Cities';

    const params = new HttpParams()
      .set('pageIndex', event.pageIndex)
      .set('pageSize', event.pageSize)
      .set("sortColumn", (this.sort)
        ? this.sort.active
        : this.defaultSortColumn)
      .set('sortOrder', (this.sort)
        ? this.sort.direction
        : this.defaultSortOrder);

    this.http.get<any>(url, {params})
      .subscribe({
        next: response => {
          this.paginator.length = response.totalCount;
          this.paginator.pageIndex = response.pageIndex;
          this.paginator.pageSize = response.pageSize;
          this.cities = new MatTableDataSource(response.data);
        },
        error: error => console.error(error)
      });
  }
}
