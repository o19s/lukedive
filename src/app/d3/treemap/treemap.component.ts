import { Component, ViewEncapsulation } from '@angular/core';

import { SolrService } from './../../solr.service';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

@Component({
  encapsulation: ViewEncapsulation.None, // Hack needed in Angular2+ to apply styles to dynamic objects
  selector: 'd3-treemap',
  templateUrl: './treemap.component.html',
  styleUrls: ['./treemap.component.css']
})
export class D3TreemapComponent {
  // Graph data
  private width: number;
  private height: number;
  private margin = { top: 20, right: 20, bottom:150, left: 40 };

  private svg: any;
  private g: any;
  private x: any;
  private y: any;

  private fieldData: any;

  private solrUrl = 'http://quepid-solr.dev.o19s.com:8985/solr/tmdb/admin/luke?fl=*';

  constructor(
    private solr: SolrService
  ) { }

  ngOnInit() {
    // Snag the luke data from TMDB
    // TODO: Hook up a textbox and form so the user can specify any URL
    this.solr.fetchLukeAggregates(this.solrUrl)
      .subscribe(
        (data: any) => {
            this.fieldData = data;
            this.refresh();
        }
      );
  }

  refresh() {
    this.initSvg();
    this.drawTreemap();
  }


  private initSvg() {
    this.svg = d3.select('svg');
    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
    this.g = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private drawTreemap() {

  }
}
