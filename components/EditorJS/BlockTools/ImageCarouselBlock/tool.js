import ImageCarouselBlock from "@/components/EditorJS/BlockTools/ImageCarouselBlock/ImageCarouselBlock";
import { ImageIcon } from "@/components/EditorJS/Icons";
import React from "react";
import ReactDOM from 'react-dom';

const dataDefaults = {
  items: []
}

export default class Tool extends React.Component{
  constructor({ data, config, api, readOnly }) {
    super({ data, config, api, readOnly })
    this.api = api;
    this.readOnly = readOnly;
    this.dataDefaults = {...dataDefaults, ...config.dataDefaults}
    this.data = {
      items: data.items || this.dataDefaults.items,
      ...config.data
    };

    this.CSS = {
      wrapper: 'imagecarouselblock',
    };

    this.nodes = {
      holder: null,
    };
  }

  static get toolbox() {
    return {
      icon: ImageIcon,
      title: "Image Carousel",
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
        <ImageCarouselBlock onDataChange={handleDataChange} readOnly={this.readOnly} data={this.data} />
      ),
    rootNode);
    
    return this.nodes.holder;
  }
}

