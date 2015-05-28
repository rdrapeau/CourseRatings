// browserify.js (our library that clumps together all these javascript files)
// needs a "main file" to derive all dependencies from and package up.
// This is that file.

/// <reference path="./def/jquery.d.ts"/>
/// <reference path="./def/d3.d.ts"/>
/// <reference path="./def/taffy.d.ts"/>

declare var require : any;

var React : any = require('react');
var AppComponent = require('./component/AppComponent.jsx');

React.render(
    React.createElement(AppComponent, {}),
    document.getElementById('content'));
