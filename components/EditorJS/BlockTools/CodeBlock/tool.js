import React, { useState } from "react";
import ReactDOM from 'react-dom';
import CodeBlock from './CodeBlock';
import { createRoot } from "react-dom/client";

const dataDefaults = {
  code: "",
  language: "",
  multiline: true,
  linenumbers: false,
  textwrap: false,
  filename: "",
  caption: "",
  render: false,
}

export default class Tool extends React.Component{
  constructor({ data, config, api, readOnly }) {
    super({ data, config, api, readOnly })
    this.api = api;
    this.readOnly = readOnly;
    this.dataDefaults = {...dataDefaults, ...config.dataDefaults}
    this.data = {
      code: data.code || this.dataDefaults.code,
      language: data.language || this.dataDefaults.language,
      multiline: data.multiline !== undefined && data.multiline !== "" ? data.multiline : this.dataDefaults.multiline,
      linenumbers: data.linenumbers !== undefined && data.linenumbers !== "" ? data.linenumbers : this.dataDefaults.linenumbers,
      textwrap: data.textwrap !== undefined && data.textwrap !== "" ? data.textwrap : this.dataDefaults.textwrap,
      filename: data.filename || this.dataDefaults.filename,
      caption: data.caption || this.dataDefaults.caption,
      render: data.render !== undefined && data.render !== "" ? data.render : this.dataDefaults.render,
      ...config.data
    };

    this.CSS = {
      wrapper: 'codeblock',
    };

    this.nodes = {
      holder: null,
    };
  }

  static get toolbox() {
    return {
      icon: '<svg fill="#000000" width="800px" height="800px" viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"> <rect id="Icons" x="-768" y="0" width="1280" height="800" style="fill:none;"/> <g id="Icons1" serif:id="Icons"> <g id="Strike"> </g> <g id="H1"> </g> <g id="H2"> </g> <g id="H3"> </g> <g id="list-ul"> </g> <g id="hamburger-1"> </g> <g id="hamburger-2"> </g> <g id="list-ol"> </g> <g id="list-task"> </g> <g id="trash"> </g> <g id="vertical-menu"> </g> <g id="horizontal-menu"> </g> <g id="sidebar-2"> </g> <g id="Pen"> </g> <g id="Pen1" serif:id="Pen"> </g> <g id="clock"> </g> <g id="external-link"> </g> <g id="hr"> </g> <g id="info"> </g> <g id="warning"> </g> <g id="plus-circle"> </g> <g id="minus-circle"> </g> <g id="vue"> </g> <g id="cog"> </g> <g id="logo"> </g> <path id="code" d="M25.027,49.084l-16.97,-16.971l16.97,-16.97l2.829,2.828l-14.143,14.142c4.714,4.714 9.429,9.428 14.143,14.142l-2.829,2.829Zm30.986,-16.971l-16.97,16.971l-2.829,-2.829l14.142,-14.142l-14.142,-14.142l2.829,-2.828l16.97,16.97Z"/> <g id="radio-check"> </g> <g id="eye-slash"> </g> <g id="eye"> </g> <g id="toggle-off"> </g> <g id="shredder"> </g> <g id="spinner--loading--dots-" serif:id="spinner [loading, dots]"> </g> <g id="react"> </g> <g id="check-selected"> </g> <g id="turn-off"> </g> <g id="code-block"> </g> <g id="user"> </g> <g id="coffee-bean"> </g> <g id="coffee-beans"> <g id="coffee-bean1" serif:id="coffee-bean"> </g> </g> <g id="coffee-bean-filled"> </g> <g id="coffee-beans-filled"> <g id="coffee-bean2" serif:id="coffee-bean"> </g> </g> <g id="clipboard"> </g> <g id="clipboard-paste"> </g> <g id="clipboard-copy"> </g> <g id="Layer1"> </g> </g> </svg>',
      title: 'Code',
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
        <CodeBlock onDataChange={handleDataChange} readOnly={this.readOnly} data={this.data} />
      ),
    rootNode);
    
    return this.nodes.holder;
  }
}

// createRoot(this.nodes.holder).render(<CodeBlock onDataChange={handleDataChange} readOnly={this.readOnly} data={this.data} />);

