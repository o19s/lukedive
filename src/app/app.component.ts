import { Component, ViewEncapsulation } from '@angular/core';

import { SolrService } from './solr.service';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

import { STATISTICS } from './statistics';


@Component({
  encapsulation: ViewEncapsulation.None, // Hack needed in Angular2+ to apply styles to dynamic objects
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Graph data
  private width: number;
  private height: number;
  private margin = { top: 20, right: 20, bottom:30, left: 40 };

  private svg: any;
  private g: any;
  private x: any;
  private y: any;

  increasingData = [ 1, 2, 4, 8, 16, 32 ];

  solrUrl = 'http://quepid-solr.dev.o19s.com:8985/solr/tmdb/admin/luke?fl=*';
  title = 'lukedive';
  version = 'v1.0.1';

  lukeData = null; 

  constructor(
    private solr: SolrService
  ) { }

  ngOnInit() {
    this.initSvg();
    this.initAxis();

    // Snag the luke data from TMDB
    // TODO: Hook up a textbox and form so the user can specify any URL
    this.solr.fetchLuke(this.solrUrl)
      .subscribe(
        (data) => {
            this.lukeData = data;
            this.refresh();
        }
      );
  }


  refresh() {
    this.drawAxis();
    this.drawBars();
  }


  private initSvg() {
    this.svg = d3.select('svg');
    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
    this.g = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private initAxis() {
    this.x = d3Scale.scaleBand().rangeRound([0, this.width]).padding(0.1);
    this.y = d3Scale.scaleLinear().rangeRound([this.height, 0]);
    this.x.domain(STATISTICS.map((d) => d.letter));
    this.y.domain([0, d3Array.max(STATISTICS, (d) => d.frequency)]);
  }

  private drawAxis() {
    this.g.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x));

    this.g.append('g')
      .attr('class', 'axis y-axis')
      .call(d3Axis.axisLeft(this.y).ticks(10, '%'))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Frequency');
  }

  private drawBars() {
    this.g.selectAll('.bar')
      .data(STATISTICS)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => this.x(d.letter))
      .attr('y', (d) => this.y(d.frequency))
      .attr('width', this.x.bandwidth())
      .attr('height', (d) => this.height - this.y(d.frequency));
  }
}
