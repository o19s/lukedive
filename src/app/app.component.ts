import { Component } from '@angular/core';

import { SolrService } from './solr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  solrUrl = 'http://quepid-solr.dev.o19s.com:8985/solr/tmdb/admin/luke?fl=*';
  title = 'lukedive';
  version = 'v1.0.1';

  lukeData = null; 

  constructor(
    private solr: SolrService
  ) { }

  ngOnInit() {
    // Snag the luke data from TMDB
    // TODO: Hook up a textbox and form so the user can specify any URL
    this.solr.fetchLuke(this.solrUrl)
      .subscribe(
        (data) => {
            this.lukeData = data;
        }
      );
  }
}
