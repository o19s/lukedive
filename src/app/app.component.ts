import { Component, ViewEncapsulation } from '@angular/core';
import { SolrService } from './solr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  solrUrl = this.solr.activeUrl;
  title = 'lukedive';
  version = 'v1.0.1';

  constructor(
    private solr: SolrService
  ) { }

  updateUrl() {
    this.solr.activeUrl = this.solrUrl;
    this.solr.onUrlChanged.emit();
  }
}
