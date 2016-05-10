/*! banana-fusion - v1.6.5 - 2016-05-11
 * https://github.com/LucidWorks/banana/wiki
 * Copyright (c) 2016 Andrew Thanalertvisuti; Licensed Apache License */

define("panels/column/module",["angular","app","underscore","config"],function(a,b,c,d){"use strict";var e=a.module("kibana.panels.column",[]);b.useModule(e),e.controller("column",["$scope","$rootScope","$timeout",function(a,b,d){a.panelMeta={status:"Stable",description:"A pseudo panel that lets you add other panels to be arranged in a column with defined heights."};var e={panels:[]};c.defaults(a.panel,e),a.init=function(){a.reset_panel()},a.toggle_row=function(b){b.collapse=!b.collapse,b.collapse||d(function(){a.send_render()})},a.send_render=function(){a.$broadcast("render")},a.add_panel=function(b){a.panel.panels.push(b)},a.reset_panel=function(b){a.new_panel={loading:!1,error:!1,sizeable:!1,span:12,height:"150px",editable:!0,type:b,draggable:!1}}}]),e.directive("columnEdit",["$compile","$timeout",function(b,d){return{scope:{new_panel:"=panel",row:"=",config:"=",dashboards:"=",type:"=type"},link:function(e,f){e.$on("render",function(){d(function(){e.panel=e.new_panel;var d="<div ng-include src=\"partial('panelgeneral')\"></div>";c.isUndefined(e.type)||""===e.type||(d=d+"<div ng-include src=\"'app/panels/"+e.type+"/editor.html'\"></div>"),f.html(b(a.element(d))(e))})})}}}]),e.filter("withoutColumn",function(){return function(){return c.without(d.panel_names,"column")}})});