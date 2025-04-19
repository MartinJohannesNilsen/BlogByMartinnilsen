import CustomDivider from "@/components/EditorJS/Renderers/CustomDivider";
import React from "react";
import { createRoot } from "react-dom/client";

export default class Tool extends React.Component{
  constructor({ data, config, api, readOnly }) {
    super({ data, config, api, readOnly })
    this.api = api;
    this.readOnly = readOnly;
    this.data = {};

    this.CSS = {
      wrapper: 'divider',
    };

    this.nodes = {
      holder: null,
    };
  }

  static get toolbox() {
    return {
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="6" y1="12" x2="10" y2="12" stroke="black" stroke-width="2" stroke-linecap="round"/><line x1="14" y1="12" x2="18" y2="12" stroke="black" stroke-width="2" stroke-linecap="round"/></svg>`,
      title: 'Divider',
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

    // Render React component
    const root = createRoot(rootNode); 
    root.render(<CustomDivider />);

    // Append to the holder
    return this.nodes.holder;
  }
}

