import FileBlock from "@/components/EditorJS/BlockTools/FileBlock/FileBlock";
import { FileIcon } from "@/components/EditorJS/Icons";
import React from "react";
import { createRoot } from "react-dom/client";

const dataDefaults = {
  type: "upload", // url, upload
  url: "",
  description: "",
  icon: "📎",
  fileRef: null,
  fileSize: null,
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
      description: data.description || this.dataDefaults.description,
      icon: data.icon || this.dataDefaults.icon,
      fileRef: data.fileRef || this.dataDefaults.fileref,
      fileSize: data.fileSize || this.dataDefaults.fileSize,
      ...config.data
    };

    this.CSS = {
      wrapper: 'fileblock',
    };

    this.nodes = {
      holder: null,
    };
  }

  static get toolbox() {
    return {
      icon: FileIcon,
      title: "File",
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
    root.render(<FileBlock onDataChange={handleDataChange} readOnly={this.readOnly} data={this.data} />);

    // Append to the holder
    return this.nodes.holder;
  }
}

