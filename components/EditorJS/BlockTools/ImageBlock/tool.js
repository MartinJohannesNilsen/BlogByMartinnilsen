import ImageBlock from "@/components/EditorJS/BlockTools/ImageBlock/ImageBlock";
import { ImageIcon } from "@/components/EditorJS/Icons";
import React from "react";
import { createRoot } from "react-dom/client";

const dataDefaults = {
  type: "upload", // url, upload, unsplash, paste?
  url: "",
  caption: "",
  blurhash: "",
  height: 0,
  width: 0,
  fileRef: null,
  fileSize: null,
  // unsplash: null
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
      fileRef: data.fileRef || this.dataDefaults.fileref,
      fileSize: data.fileSize || this.dataDefaults.fileSize,
      // unsplash: data.unsplash || this.dataDefaults.unsplash,
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
      icon: ImageIcon,
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
      
    // Render React component
    const root = createRoot(rootNode); 
    root.render(<ImageBlock onDataChange={handleDataChange} readOnly={this.readOnly} data={this.data} />);

    // Append to the holder
    return this.nodes.holder;
  }
}

