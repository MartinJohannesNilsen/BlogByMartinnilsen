import InlineVideo from '@/components/EditorJS/BlockTools/InlineVideo/InlineVideo';
import React from "react";
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
      icon: `<svg width="220px" height="220px" viewBox="-1.28 -1.28 66.56 66.56" xmlns="http://www.w3.org/2000/svg" stroke-width="3.2" stroke="#000000" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><rect x="8.5" y="12.5" width="47" height="39" rx="2"></rect><line x1="8.5" y1="20.88" x2="55.5" y2="20.88"></line><path d="M28.06,30.42V41.7a.5.5,0,0,0,.8.4l9.29-5.7a.49.49,0,0,0-.07-.85L28.79,30A.51.51,0,0,0,28.06,30.42Z"></path><line x1="10.5" y1="12.5" x2="17.33" y2="20.88"></line><line x1="17.41" y1="12.5" x2="24.24" y2="20.88"></line><line x1="24.38" y1="12.5" x2="31.21" y2="20.88"></line><line x1="31.77" y1="12.5" x2="38.6" y2="20.88"></line><line x1="39.15" y1="12.5" x2="45.98" y2="20.88"></line><line x1="46.67" y1="12.5" x2="53.5" y2="20.88"></line></g></svg>`,
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
    
    // Render React component
    const root = createRoot(rootNode); 
    root.render(<InlineVideo onDataChange={handleDataChange} readOnly={this.readOnly} data={this.data} />);

    // Append to the holder
    return this.nodes.holder;
  }
}

