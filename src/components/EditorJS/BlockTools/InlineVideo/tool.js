import React, { useState } from "react";
import ReactDOM from 'react-dom';
import InlineVideo from './InlineVideo';
import { createRoot } from "react-dom/client";

export default class Tool extends React.Component{
  constructor({ data, config, api, readOnly }) {
    super({ data, config, api, readOnly })
    this.api = api;
    this.readOnly = readOnly;
    this.data = {
      url: data.url || "",
    };

    this.CSS = {
      wrapper: 'inline-video',
    };

    this.nodes = {
      holder: null,
    };
  }

  static get toolbox() {
    return {
      icon: `<svg version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  	 width="800px" height="800px" viewBox="0 0 512 512"  xml:space="preserve"> <style type="text/css"> <![CDATA[ 	.st0{fill:#000000;} ]]> </style> <g> 	<path class="st0" d="M412.42,174.719l39.922,57.688h-45.141l-39.938-57.688h-57.109l39.938,57.688h-45.156l-39.922-57.688h-57.109 		l39.922,57.688h-45.141l-39.922-57.688h-57.109l39.922,57.688H100.42l-38.453-55.578L459.779,65.844l-4.484-16.047l-0.953-3.438 		l-6.203-22.203C444.186,9.969,431.592,0.656,417.654,0l-21.672,62.641l-43.5,12.141l22.406-64.75l-55,15.344l-22.406,64.75 		l-43.484,12.125l22.406-64.75l-55.016,15.344l-22.406,64.766l-43.484,12.125L177.904,65l-55.016,15.344l-22.391,64.75 		l-43.484,12.125l22.391-64.75l-18.516,5.172c-17.703,4.938-28.063,23.297-23.125,41.016l6.203,22.188l-1.297,0.375l5.438,19.469 		l1.328-0.375v52.094v2.219v244.094c0,18.375,14.906,33.281,33.281,33.281h359.469c18.391,0,33.281-14.906,33.281-33.281V234.625 		v-2.219v-57.688H412.42z M315.576,376.969L230.904,427.5c-0.609,0.375-1.375,0.406-1.984,0.031c-0.625-0.344-1.016-1-1.016-1.734 		v-50.531V324.75c0-0.719,0.391-1.375,1.016-1.75c0.609-0.344,1.375-0.313,1.984,0.031l84.672,50.531 		c0.594,0.359,0.953,1.031,0.953,1.703C316.529,375.969,316.17,376.625,315.576,376.969z"/> </g> </svg>`,
      title: 'Video',
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  save() {
    return this.data;
  }
  

  render() {
    // Config
    const rootNode = document.createElement('div');
    rootNode.setAttribute('class', this.CSS.wrapper);
    this.nodes.holder = rootNode;
    
    const handleDataChange = (newData) => {
      this.data = newData
    }

    ReactDOM.render(
      (
        <InlineVideo onDataChange={handleDataChange} readOnly={this.readOnly} data={this.data} />
      ),
    rootNode);
    
    return this.nodes.holder;
  }
}

// createRoot(this.nodes.holder).render(<InlineVideo onDataChange={handleDataChange} readOnly={this.readOnly} data={this.data} />);

