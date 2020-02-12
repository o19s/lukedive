import { Component, ViewEncapsulation } from '@angular/core';

import { SolrService } from './../../solr.service';

import * as d3 from 'd3-selection';
import * as d3Chromatic from 'd3-scale-chromatic';
import * as d3Hierarchy from 'd3-hierarchy';
import * as d3Interpolate from 'd3-interpolate';
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
    this.svg = d3.select('svg.treemap');
    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
  }

  private drawTreemap() {
    let root = d3Hierarchy.hierarchy(this.fieldData)
      .eachBefore( (d) => d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name)
      .sum((d) => d.count)
      .sort((a, b) => b.height - a.height || b.value - a.value);

    // This call figures out positions and augments the root data
    d3Hierarchy.treemap()
      .tile(d3Hierarchy.treemapResquarify)
      .size([this.width, this.height])
      .round(true)
      .paddingInner(1)
      (root);

    // Setup fader and color scale
    let fader = (color) => d3Interpolate.interpolateRgb(color, '#fff')(0.2);
    let color = d3Scale.scaleOrdinal(d3Chromatic.schemePaired.map(fader));

    // Opacity scale
    // TODO: Factor this is with a dynamic range based off the total numTerms
    var opacity = d3Scale.scaleLinear()
      .domain([10, 30])
      .range([.5,1]);

    console.log(root.leaves());
    let cell = this.svg.selectAll('g')
      .data(root.leaves())
      .enter().append('g')
        .attr('transform', (d) => `translate(${d.x0},${d.y0})`);

    // Create rectangles
    cell.append('rect')
      .attr('id', (d) => d.data.id)
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('fill', (d) => color(d.parent.data.id));

    // Setup clip paths
    cell.append('clipPath')
        .attr('id', (d) => `clip-${d.data.id}`)
      .append('use')
        .attr('xlink:href', (d) => `#${d.data.id}`);

    // Clip paths and render text
    cell.append('text')
        .attr('clip-path', (d) => `url(#clip-${d.data.id})`)
      .selectAll('tspan')
        .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g)) // TODO: WTF is this doing?
      .enter().append('tspan')
        .attr('x', 4)
        .attr('y', (d, i) => 13 + i * 10)
        .text((d) => d)

    // Add title to the cell
    cell.append('title')
      .text((d) => `${d.data.id}\n${d.data.count}`);
  }
}
