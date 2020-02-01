import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SolrService {
  constructor(
    private http: HttpClient
  ) { }

  fetchLuke(url: string) {
    return this.http.jsonp(url, 'json.wrf');
  }
}
