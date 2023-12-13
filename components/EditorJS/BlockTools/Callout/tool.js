import React, { useState } from "react";
import ReactDOM from 'react-dom';
import Callout from "./Callout";

const dataDefaults = {
  type: "message",
  message: "",
  title: "",
  icon: "💬",
}

export default class Tool extends React.Component{
  constructor({ data, config, api, readOnly }) {
    super({ data, config, api, readOnly })
    this.api = api;
    this.readOnly = readOnly;
    this.dataDefaults = {...dataDefaults, ...config.dataDefaults}
    this.data = {
      type: data.type || this.dataDefaults.type,
      message: data.message || this.dataDefaults.message,
      title: data.title || this.dataDefaults.title,
      icon: data.icon || this.dataDefaults.icon,
      ...config.data
    };

    this.CSS = {
      wrapper: 'callout',
    };

    this.nodes = {
      holder: null,
    };
  }

  static get toolbox() {
    return {
      icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 	 viewBox="0 0 800 800" style="enable-background:new 0 0 800 800;" xml:space="preserve"> <g id="Page-1"> 	<g id="ic-message-type"> 		<path id="Oval-1" d="M256.9,644.2l-102.6,25.4v-85.2c-56.7-48.5-91.9-114.2-91.9-188.3c0-154.8,153.9-273.5,336.9-273.5 			s336.9,118.7,336.9,273.5S582.2,669.6,399.3,669.6C348.7,669.6,300.3,660.6,256.9,644.2z M399.3,608.8 			c152.2,0,275.6-95.3,275.6-212.7S551.5,183.4,399.3,183.4s-275.6,95.2-275.6,212.7S247,608.8,399.3,608.8z M399.3,426.5 			c-16.9,0-30.6-13.6-30.6-30.4s13.7-30.4,30.6-30.4s30.6,13.6,30.6,30.4S416.2,426.5,399.3,426.5z M276.8,426.5 			c-16.9,0-30.6-13.6-30.6-30.4s13.7-30.4,30.6-30.4c16.9,0,30.6,13.6,30.6,30.4S293.7,426.5,276.8,426.5z M521.7,426.5 			c-16.9,0-30.6-13.6-30.6-30.4s13.7-30.4,30.6-30.4c16.9,0,30.6,13.6,30.6,30.4C552.4,412.9,538.6,426.5,521.7,426.5z"/> 	</g> </g> </svg>',
      title: "Callout",
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
      this.data = newData;
    }

    ReactDOM.render(
      (
        <Callout onDataChange={handleDataChange} readOnly={this.readOnly} data={this.data} />
      ),
    rootNode);
    
    return this.nodes.holder;
  }
}


