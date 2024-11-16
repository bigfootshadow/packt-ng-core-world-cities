import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

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
    console.log(environment.baseUrl + 'api/Cities');
    this.http.get<City[]>(environment.baseUrl + 'api/Cities')
      .subscribe({
        next: (result) => {
          this.cities = new MatTableDataSource(result);
          this.cities.paginator = this.paginator;
        },
        error: (error) => {
          console.error(error);
        }
      });
    this.cities
  }

}
