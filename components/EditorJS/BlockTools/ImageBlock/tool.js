import React, { useState } from "react";
import ReactDOM from 'react-dom';
import ImageBlock from "./ImageBlock";
import { ImageUploadIcon } from "../../Icons";

const dataDefaults = {
  type: "upload", // url, upload, unsplash, paste?
  url: "",
  caption: "",
  blurhash: "",
  height: 0,
  width: 0,
  filename: null,
  unsplash: null
}

export default class Tool extends React.Component{
  constructor({ data, config, api, readOnly }) {
    super({ data, config, api, readOnly })
    this.api = api;
    this.readOnly = readOnly;
    this.dataDefaults = {...dataDefaults, ...config.dataDefaults}
    this.data = {
      type: data.type || this.dataDefaults.type,
      url: data.url || this.dataDefaults.url,
      caption: data.caption || this.dataDefaults.caption,
      blurhash: data.blurhash || this.dataDefaults.blurhash,
      height: data.height || this.dataDefaults.height,
      width: data.width || this.dataDefaults.width,
      filename: data.filename || this.dataDefaults.filename,
      unsplash: data.unsplash || this.dataDefaults.unsplash,
      ...config.data
    };

    this.CSS = {
      wrapper: 'imageblock',
    };

    this.nodes = {
      holder: null,
    };
  }

  static get toolbox() {
    return {
      icon: ImageUploadIcon,
      title: "Image",
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
        <ImageBlock onDataChange={handleDataChange} readOnly={this.readOnly} data={this.data} />
      ),
    rootNode);
    
    return this.nodes.holder;
  }
}

