import Paragraph from '@editorjs/paragraph'
import List from '@editorjs/list'
import Warning from '@editorjs/warning'
import LinkTool from '@editorjs/link'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import SimpleImage from '@editorjs/simple-image'
import InlineImage from 'editorjs-inline-image';
import Embed from '@editorjs/embed'
// Code highlight editors
import CodeBlock from 'editorjs-code-highlight' // Nice try, but textarea and marker is off
import CodeBox from '@bomdi/codebox'; // Weird html format out, else good
import editorjsCodeflask from '@calumk/editorjs-codeflask';

// import Table from '@editorjs/table'
// import Raw from '@editorjs/raw'


export const EDITOR_JS_TOOLS = {
  paragraph: {
    class: Paragraph,
    linkTool: true,
    config: {
      // placeholder: "What do you want to share with the world?",
      preserveBlank: true,
    }
  },
  h1: {
    class: Header,
    toolbox: {
      icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 	 viewBox="0 0 800 800" style="enable-background:new 0 0 800 800;" xml:space="preserve"> <style type="text/css"> 	.st0{fill:none;} 	.st1{stroke:#000000;stroke-width:0.25;stroke-miterlimit:10;} </style> <rect class="st0" width="800" height="800"/> <g> 	<path class="st1" d="M481,183.8v173H319v-173h-81v432.5h81v-173h162v173h81V183.8"/> </g> </svg>',
      title: 'H1',
      data: {
        level: 1
      }
    }
  },
  h2: {
    class: Header,
    toolbox: {
      icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 	 viewBox="0 0 800 800" style="enable-background:new 0 0 800 800;" xml:space="preserve"> <style type="text/css"> 	.st0{fill:none;} 	.st1{stroke:#000000;stroke-width:0.25;stroke-miterlimit:10;} </style> <rect class="st0" width="800" height="800"/> <g> 	<path class="st1" d="M481,183.8v173H319v-173h-81v432.5h81v-173h162v173h81V183.8"/> </g> </svg>',
      title: 'H2',
      data: {
        level: 2
      }
    }
  },
  h3: {
    class: Header,
    toolbox: {
      icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 	 viewBox="0 0 800 800" style="enable-background:new 0 0 800 800;" xml:space="preserve"> <style type="text/css"> 	.st0{fill:none;} 	.st1{stroke:#000000;stroke-width:0.25;stroke-miterlimit:10;} </style> <rect class="st0" width="800" height="800"/> <g> 	<path class="st1" d="M481,183.8v173H319v-173h-81v432.5h81v-173h162v173h81V183.8"/> </g> </svg>',
      title: 'H3',
      data: {
        level: 3
      }
    }
  },
  h4: {
    class: Header,
    toolbox: {
      icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 	 viewBox="0 0 800 800" style="enable-background:new 0 0 800 800;" xml:space="preserve"> <style type="text/css"> 	.st0{fill:none;} 	.st1{stroke:#000000;stroke-width:0.25;stroke-miterlimit:10;} </style> <rect class="st0" width="800" height="800"/> <g> 	<path class="st1" d="M481,183.8v173H319v-173h-81v432.5h81v-173h162v173h81V183.8"/> </g> </svg>',
      title: 'H4',
      data: {
        level: 4
      }
    }
  },
  list: List,
  warning: {
    class: Warning,
    toolbox: {
      icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 	 viewBox="0 0 800 800" style="enable-background:new 0 0 800 800;" xml:space="preserve"> <g id="Page-1"> 	<g id="ic-message-type"> 		<path id="Oval-1" d="M256.9,644.2l-102.6,25.4v-85.2c-56.7-48.5-91.9-114.2-91.9-188.3c0-154.8,153.9-273.5,336.9-273.5 			s336.9,118.7,336.9,273.5S582.2,669.6,399.3,669.6C348.7,669.6,300.3,660.6,256.9,644.2z M399.3,608.8 			c152.2,0,275.6-95.3,275.6-212.7S551.5,183.4,399.3,183.4s-275.6,95.2-275.6,212.7S247,608.8,399.3,608.8z M399.3,426.5 			c-16.9,0-30.6-13.6-30.6-30.4s13.7-30.4,30.6-30.4s30.6,13.6,30.6,30.4S416.2,426.5,399.3,426.5z M276.8,426.5 			c-16.9,0-30.6-13.6-30.6-30.4s13.7-30.4,30.6-30.4c16.9,0,30.6,13.6,30.6,30.4S293.7,426.5,276.8,426.5z M521.7,426.5 			c-16.9,0-30.6-13.6-30.6-30.4s13.7-30.4,30.6-30.4c16.9,0,30.6,13.6,30.6,30.4C552.4,412.9,538.6,426.5,521.7,426.5z"/> 	</g> </g> </svg>',
      title: 'Callout',
    }
  },
  quote: Quote,
  marker: Marker,
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  code: {
    // Codeflask
    class: editorjsCodeflask,

    // // CodeBox
    // class: CodeBox,
    // config: {
    //   // themeURL: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/ir-black.min.css', // Optional
    //   // themeName: 'ir-black', // Optional
    //   useDefaultTheme: 'light' // Optional. This also determines the background color of the language select drop-down
    // },

    // CodeBlock
    // class: CodeBlock,
    // config: {
    //   allowValidation: true, // ignores code block that has empty code when saving
    //   // supportedLanguages: [
    //   //   {
    //   //     label: 'Py', // custom name here. Then select box will show 'py' for python instead of 'Python'
    //   //     value: 'python', // make sure it's the same alias as highlightjs common language alias
    //   //   },
    //   // ],
    //   defaultLanguage: 'plaintext' // 'plaintext' wil be the default when EditorJS first initialized
    // },
    toolbox: {
      icon: '<svg fill="#000000" width="800px" height="800px" viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"> <rect id="Icons" x="-768" y="0" width="1280" height="800" style="fill:none;"/> <g id="Icons1" serif:id="Icons"> <g id="Strike"> </g> <g id="H1"> </g> <g id="H2"> </g> <g id="H3"> </g> <g id="list-ul"> </g> <g id="hamburger-1"> </g> <g id="hamburger-2"> </g> <g id="list-ol"> </g> <g id="list-task"> </g> <g id="trash"> </g> <g id="vertical-menu"> </g> <g id="horizontal-menu"> </g> <g id="sidebar-2"> </g> <g id="Pen"> </g> <g id="Pen1" serif:id="Pen"> </g> <g id="clock"> </g> <g id="external-link"> </g> <g id="hr"> </g> <g id="info"> </g> <g id="warning"> </g> <g id="plus-circle"> </g> <g id="minus-circle"> </g> <g id="vue"> </g> <g id="cog"> </g> <g id="logo"> </g> <path id="code" d="M25.027,49.084l-16.97,-16.971l16.97,-16.97l2.829,2.828l-14.143,14.142c4.714,4.714 9.429,9.428 14.143,14.142l-2.829,2.829Zm30.986,-16.971l-16.97,16.971l-2.829,-2.829l14.142,-14.142l-14.142,-14.142l2.829,-2.828l16.97,16.97Z"/> <g id="radio-check"> </g> <g id="eye-slash"> </g> <g id="eye"> </g> <g id="toggle-off"> </g> <g id="shredder"> </g> <g id="spinner--loading--dots-" serif:id="spinner [loading, dots]"> </g> <g id="react"> </g> <g id="check-selected"> </g> <g id="turn-off"> </g> <g id="code-block"> </g> <g id="user"> </g> <g id="coffee-bean"> </g> <g id="coffee-beans"> <g id="coffee-bean1" serif:id="coffee-bean"> </g> </g> <g id="coffee-bean-filled"> </g> <g id="coffee-beans-filled"> <g id="coffee-bean2" serif:id="coffee-bean"> </g> </g> <g id="clipboard"> </g> <g id="clipboard-paste"> </g> <g id="clipboard-copy"> </g> <g id="Layer1"> </g> </g> </svg>',
      title: 'Code'
    }
  },
  simpleImage: SimpleImage,
  image: {
    class: InlineImage,
    inlineToolbar: true,
    config: {
      embed: {
        display: true,
      },
      unsplash: {
        appName: 'tech_blog',
        clientId: process.env.REACT_APP_UNSPLASH_access_key,
        maxResults: '12'
      }
    },
    toolbox: {
      icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 91.24" style="enable-background:new 0 0 122.88 91.24" xml:space="preserve"><g><path d="M6.23,0H116.7c1.72,0,3.25,0.7,4.37,1.81c1.11,1.11,1.81,2.69,1.81,4.37v78.88c0,1.72-0.7,3.25-1.81,4.37 c-0.09,0.09-0.19,0.19-0.33,0.28c-1.07,0.98-2.51,1.53-4.09,1.53H6.18c-1.72,0-3.25-0.7-4.37-1.81C0.7,88.32,0,86.74,0,85.06V6.18 c0-1.72,0.7-3.25,1.81-4.37S4.51,0,6.18,0L6.23,0L6.23,0L6.23,0z M31.74,21.42c4.9,0,8.87,3.97,8.87,8.86 c0,4.9-3.97,8.87-8.87,8.87s-8.87-3.97-8.87-8.87C22.87,25.39,26.84,21.42,31.74,21.42L31.74,21.42L31.74,21.42z M69.05,59.46 l17.73-30.66l18.84,47.65l-87.92,0v-5.91l7.39-0.37l7.39-18.1l3.69,12.93h11.08l9.6-24.75L69.05,59.46L69.05,59.46L69.05,59.46z M115.54,7.34H7.39v76.51h108.15L115.54,7.34L115.54,7.34L115.54,7.34z"/></g></svg>',
      title: 'Image'
    }
  },
  embed: {
    class: Embed,
    inlineToolbar: true,
    config: {
      // services: { // Service-specific settings
      //   twitter: {
      //     regex: /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+?.*)?$/,
      //     embedUrl: 'https://twitframe.com/show?url=https://twitter.com/<%= remote_id %>',
      //     html: '<iframe width="600" height="600" style="margin: 0 auto;" frameborder="0" scrolling="no" allowtransparency="true"></iframe>',
      //     maxHeight: "600px",
      //     id: ids => ids.join('/status/'),
      //   },
      // }
    }
  },
  math: {
    class: EJLaTeX,
    shortcut: 'CMD+SHIFT+M',
    toolbox: {
      icon: '<svg fill="#000000" width="800px" height="800px" viewBox="0 0 1024 1024" t="1569683610100" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12238" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css"></style></defs><path d="M841 370c3-3.3 2.7-8.3-0.6-11.3-1.5-1.3-3.4-2.1-5.3-2.1h-72.6c-2.4 0-4.6 1-6.1 2.8L633.5 504.6c-2.9 3.4-7.9 3.8-11.3 0.9-0.9-0.8-1.6-1.7-2.1-2.8l-63.5-141.3c-1.3-2.9-4.1-4.7-7.3-4.7H380.7l0.9-4.7 8-42.3c10.5-55.4 38-81.4 85.8-81.4 18.6 0 35.5 1.7 48.8 4.7l14.1-66.8c-22.6-4.7-35.2-6.1-54.9-6.1-103.3 0-156.4 44.3-175.9 147.3l-9.4 49.4h-97.6c-3.8 0-7.1 2.7-7.8 6.4L181.9 415c-0.9 4.3 1.9 8.6 6.2 9.5 0.5 0.1 1.1 0.2 1.6 0.2H284l-89 429.9c-0.9 4.3 1.9 8.6 6.2 9.5 0.5 0.1 1.1 0.2 1.6 0.2H269c3.8 0 7.1-2.7 7.8-6.4l89.7-433.1h135.8l68.2 139.1c1.4 2.9 1 6.4-1.2 8.8l-180.6 203c-2.9 3.3-2.6 8.4 0.7 11.3 1.5 1.3 3.4 2 5.3 2h72.7c2.4 0 4.6-1 6.1-2.8l123.7-146.7c2.8-3.4 7.9-3.8 11.3-1 0.9 0.8 1.6 1.7 2.1 2.8L676.4 784c1.3 2.8 4.1 4.7 7.3 4.7h64.6c4.4 0 8-3.6 8-8 0-1.2-0.3-2.4-0.8-3.5l-95.2-198.9c-1.4-2.9-0.9-6.4 1.3-8.8L841 370z" p-id="12239"></path></svg>',
      title: 'Math',
    }
  },
  linkTool: {
    class: LinkTool,
    config: {
      endpoint: 'http://localhost:3001/fetchLinkPreview', // Your backend endpoint for url data fetching,
    }
  },
  header: {
    class: Header,
  },
  // table: Table,
  
}
export default EDITOR_JS_TOOLS;