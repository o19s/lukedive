import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SolrService {
  constructor(
    private http: HttpClient
  ) { }

  /**
  * Returns the raw data from luke, useful for custom manipulation of data outside the service.
  *
  */
  fetchLuke(url: string) {
    return this.http.jsonp(url, 'json.wrf');
  }

  /**
  * Returns a hierarchy structure of luke field data.
  *
  */
  fetchLukeAggregates(url: string) {
    return this.fetchLuke(url).pipe(map(
      (data: any)  => {
        let transform: any = {
          'name': 'luke',
          'children': []
        };

        let aggregates: any = {};
        Object.entries(data.fields).forEach((value: any, key: number) => {
          // Create child holder if it doesn't already exist
          if ( !aggregates[value[1].type] ) {
            aggregates[value[1].type] = [];
          }

          // Add field to holder - ex: text_en -> [cast, title, overview]
          aggregates[value[1].type].push({'name': value[0], 'count': value[1].distinct});
        });

        return aggregates;
      })
    );
  }

  /**
  * Fetch flattened counts from luke
  */
  fetchLukeCounts(url: string) {
    return this.fetchLuke(url).pipe(map(
      (data: any) => {
        let flattened: any = [];

        // Organize field term counts into a structure easier to throw into D3
        Object.entries(data.fields).forEach((value: any, key: number) => {
          flattened.push({field: value[0], count: value[1].distinct});
        });

        return flattened;
      })
    );
  }
}
