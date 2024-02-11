import React, { useState } from "react";
import ReactDOM from 'react-dom';
import Quote from "./Quote";
import { QuoteIcon } from "../../Icons";

const dataDefaults = {
  text: "",
  caption: "",
}

export default class Tool extends React.Component{
  constructor({ data, config, api, readOnly }) {
    super({ data, config, api, readOnly })
    this.api = api;
    this.readOnly = readOnly;
    this.dataDefaults = {...dataDefaults, ...config.dataDefaults}
    this.data = {
      text: data.text || this.dataDefaults.text,
      caption: data.caption || this.dataDefaults.caption,
      ...config.data
    };

    this.CSS = {
      wrapper: 'quote',
    };

    this.nodes = {
      holder: null,
    };
  }

  static get toolbox() {
    return {
      icon: QuoteIcon,
      title: "Quote",
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
        <Quote onDataChange={handleDataChange} readOnly={this.readOnly} data={this.data} />
      ),
    rootNode);
    
    return this.nodes.holder;
  }
}


