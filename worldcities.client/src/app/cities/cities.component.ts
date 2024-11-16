import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { City } from './City';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.scss'
})
export class CitiesComponent implements OnInit {

  public cities: City[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    console.log(environment.baseUrl + 'api/Cities');
    this.http.get<City[]>(environment.baseUrl + 'api/Cities')
      .subscribe({
        next: (result) => {
          this.cities = result;
        },
        error: (error) => {
          console.error(error);
        }
      });
    this.cities
  }

}
