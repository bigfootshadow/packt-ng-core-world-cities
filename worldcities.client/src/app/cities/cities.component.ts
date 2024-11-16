import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

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
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = 1;
    pageEvent.pageSize = 10;
    this.getData(pageEvent);
  }

  getData(event: PageEvent){
    const url = environment.baseUrl + 'api/Cities';

    const params = new HttpParams()
      .set('pageIndex', event.pageIndex)
      .set('pageSize', event.pageSize);

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
