/*! banana-fusion - v1.6.5 - 2016-05-11
 * https://github.com/LucidWorks/banana/wiki
 * Copyright (c) 2016 Andrew Thanalertvisuti; Licensed Apache License */

define("panels/sunburst/module",["angular","app","underscore","jquery","d3"],function(a,b,c,d,e){"use strict";var f=a.module("kibana.panels.sunburst",[]);b.useModule(f),f.controller("sunburst",["$scope","dashboard","querySrv","filterSrv",function(b,d,e,f){b.panelMeta={modals:[{description:"Inspect",icon:"icon-info-sign",partial:"app/partials/inspector.html",show:b.panel.spyable}],editorTabs:[{title:"Queries",src:"app/partials/querySelect.html"}],status:"Experimental",description:"This panel generates a sunburst graphic based on solr Facet Pivots output. "};var g={queries:{mode:"all",ids:[],query:"*:*",custom:""},facet_limit:1e3,spyable:!0,show_queries:!0};c.defaults(b.panel,g);var h=!0;b.init=function(){b.$on("refresh",function(){b.get_data()}),b.get_data()},b.parse_facet_pivot=function(a){var c={name:"root",children:[]};for(var d in a)c.children.push(b.parse_item(a[d]));return c},b.parse_item=function(a){var c={name:a.value,size:a.count,children:[]};for(var d in a.pivot)c.children.push(b.parse_item(a.pivot[d]));return c},b.get_data=function(){b.panelMeta.loading=!0,delete b.panel.error;var a,g;b.sjs.client.server(d.current.solr.server+d.current.solr.core_name),b.panel.queries.ids=e.idsByMode(b.panel.queries);var i=b.sjs.BoolQuery();c.each(b.panel.queries.ids,function(a){i=i.should(e.getEjsObj(a))}),a=b.sjs.Request().indices(d.indices),a=a.query(b.sjs.FilteredQuery(i,f.getBoolFilter(f.ids))),b.populate_modal(a);var j="";f.getSolrFq()&&(j="&"+f.getSolrFq());var k="&wt=json",l="&rows=0",m="&facet=true",n="&facet.pivot="+b.panel.facet_pivot_strings.join().replace(/ /g,""),o="&facet.limit="+b.panel.facet_limit;b.panel.queries.query=e.getORquery()+j+k+m+n+o+l,h&&console.log(b.panel.queries.query),a=null!=b.panel.queries.custom?a.setQuery(b.panel.queries.query+b.panel.queries.custom):a.setQuery(b.panel.queries.query),g=a.doSearch(),g.then(function(a){b.data=b.parse_facet_pivot(a.facet_counts.facet_pivot[b.panel.facet_pivot_strings.join().replace(/ /g,"")]),console.log(b.data),b.render()})},b.dash=d,b.set_refresh=function(a){b.refresh=a},b.close_edit=function(){b.refresh&&b.get_data(),b.refresh=!1,b.$emit("render")},b.render=function(){b.$emit("render")},b.populate_modal=function(c){b.inspector=a.toJson(JSON.parse(c.toString()),!0)},b.pad=function(a){return(10>a?"0":"")+a},b.set_filters=function(a){h&&console.log("Setting Filters to "+a);for(var c=0;c<a.length;c++)f.set({type:"terms",field:b.panel.facet_pivot_strings[c].replace(/ /g,""),mandate:"must",value:a[c]}),console.log(b.panel.facet_pivot_strings[c].replace(/ /g,"")+" - "+a[c]);d.refresh()}}]),f.directive("sunburst",function(){return{terminal:!0,restrict:"E",link:function(b,c){function f(){function a(a){var c=i(a),d=c.map(function(a){return a.name});b.set_filters(d)}function f(a){a.x0=a.x,a.dx0=a.dx}function g(a){var c=i(a);e.selectAll("path").style("opacity",.3),e.selectAll("path").filter(function(a){return c.indexOf(a)>=0}).style("opacity",1),u.html(a.name+" ("+b.dash.numberWithCommas(a.size)+")").place_tt(e.event.pageX,e.event.pageY)}function h(){e.selectAll("path").style("opacity",1),u.detach()}function i(a){for(var b=[],c=a;c.parent;)b.unshift(c),c=c.parent;return b}var j=!0;j&&(console.log("Starting to Render Sunburst"),console.log(b.data)),c.html("");var k=c[0],l=c.parent().width(),m=parseInt(b.row.height),n={top:30,right:20,bottom:10,left:20},o=l-n.left-n.right;e.selectAll("#sunbursttooltip").remove(),m=m-n.top-n.bottom;var p=e.scale.category20c(),q=Math.min(o,m)/2,r=e.select(k).append("svg").style("height",m).style("width",o).append("g").attr("transform","translate("+o/2+","+.5*m+")"),s=e.layout.partition().sort(null).size([2*Math.PI,q*q]).value(function(a){return a.size}).children(function(a){return a.children}),t=e.svg.arc().startAngle(function(a){return a.x}).endAngle(function(a){return a.x+a.dx}).innerRadius(function(a){return Math.sqrt(a.y)}).outerRadius(function(a){return Math.sqrt(a.y+a.dy)});r.datum(b.data).selectAll("path").data(s.nodes).enter().append("path").attr("display",function(a){return a.depth?null:"none"}).attr("d",t).attr("bs-tooltip",function(){return"'hello'"}).style("stroke","#fff").style("fill",function(a){return a.depth>0?p(a.name):void 0}).each(f).on("mouseover",g).on("mouseleave",h).on("click",a),r.selectAll("text.label").data(s(b.data)),b.panelMeta.loading=!1;var u=d('<div id="sunbursttooltip">')}b.$on("render",function(){console.log("Sending SunBurzt 'render' Emit"),f()}),a.element(window).bind("resize",function(){f()})}}})});