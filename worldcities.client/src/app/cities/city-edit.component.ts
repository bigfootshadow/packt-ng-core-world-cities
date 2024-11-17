import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { environment } from "../../environments/environment";
import { City } from "./city";

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrl: './city-edit.component.scss'
})

export class CityEditComponent implements OnInit {

  title?: string;
  form!: FormGroup;
  city?: City;

  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
      this.form = new FormGroup({
        name: new FormControl(''),
        lat: new FormControl(''),
        lon: new FormControl('')
      });

      this.loadData();
  }

  private loadData() {
    let idParam = this.activatedRoute.snapshot.paramMap.get('id');
    let id = idParam ? +idParam : 0;

    let url = environment.baseUrl + 'api/Cities/' + id;
    this.http.get<City>(url).subscribe({
      next: (result) => {
        this.city = result;
        this.title = 'Edit: ' + result.name;

        // update form fields
        this.form.patchValue(this.city);
      },
      error: (error) => {console.error(error);}
    });
  }

  onSubmit() {
    let city = this.city;

    if(city) {
      city.name = this.form.controls['name'].value;
      city.lat = +this.form.controls['lat'].value;
      city.lon = +this.form.controls['lon'].value;

      let url = environment.baseUrl + 'api/Cities/' + city.id;
      this.http.put<City>(url, city).subscribe({
        next: (result) => {
          console.log('City ' + city!.id + ' updated');
          this.router.navigate(['/cities']);
        },
        error: (error) => {console.error(error);}
      });
    }

  }
}
