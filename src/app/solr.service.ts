import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SolrService {
  activeUrl: string = 'http://quepid-solr.dev.o19s.com:8985/solr/tmdb';

  // Emitters
  onUrlChanged = new EventEmitter<any>();

  constructor(
    private http: HttpClient
  ) { }

  /**
  * Returns the raw data from luke, useful for custom manipulation of data outside the service.
  *
  */
  fetchLuke(url: string) {
    let fullLukeUrl = url + '/admin/luke?fl=*';
    return this.http.jsonp(fullLukeUrl, 'json.wrf');
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

        // Aggregate on field type
        let aggregates: any = {};
        Object.entries(data.fields).forEach((value: any, key: number) => {
          // Create child holder if it doesn't already exist
          if ( !aggregates[value[1].type] ) {
            aggregates[value[1].type] = [];
          }

          // Add field to holder - ex: text_en -> [cast, title, overview]
          aggregates[value[1].type].push({'name': value[0], 'count': value[1].distinct});
        });

        // Build hierarchy structure from aggregate
        for (let key in aggregates) {
            let child: any = {name: key, children: []};

            for ( let subKey of aggregates[key] ) {
                let element = {name: subKey.name, count: subKey.count};
                child.children.push(element);
            }

            transform.children.push(child);
        }

        return transform;
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
