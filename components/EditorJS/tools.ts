// General
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { cloudStorage } from "../../lib/firebaseConfig";
// Tools
import CheckList from "@editorjs/checklist";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";
import SimpleImage from "@editorjs/simple-image";
import Underline from "@editorjs/underline";
import InlineImage from "editorjs-inline-image";
import ToggleBlock from "editorjs-toggle-block";
// @ts-ignore
import Table from "@martinjohannesnilsen/editorjs-table";
const EJLaTeX = require("editorjs-latex"); // Math
const Iframe = require("@hammaadhrasheedh/editorjs-iframe");

// Custom tools
import InlineVideo from "./BlockTools/InlineVideo/tool";
import Divider from "./BlockTools/Divider/tool";
import CodeBlock from "./BlockTools/CodeBlock/tool";
import Callout from "./BlockTools/Callout/tool";

// Dev
import ChangeCase from "./BlockTools/ChangeCase/change-case";
// import ChangeCase from "editorjs-change-case";

export const EDITOR_JS_TOOLS = {
  underline: { class: Underline, shortcut: "CMD+U" },
  paragraph: {
    class: Paragraph,
    linkTool: true,
    config: {
      // placeholder: "What do you want to share with the world?",
      preserveBlank: true,
    },
  },
  marker: { class: Marker, shortcut: "CMD+F" },
  inlineCode: { class: InlineCode, shortcut: "CMD+E" },
  // changeCase: {
  //   class: ChangeCase,
  //   config: {
  //     // showLocaleOption: true, // enable locale case options
  //     // locale: "tr", // or ['tr', 'TR', 'tr-TR']
  //   },
  //   toolbox: {
  //     icon: '<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 359.24"><path fill-rule="nonzero" d="M314.12 356.1h-78.57l88.53-268.09h99.46L512 356.1h-78.51l-15.5-51.29H329.6l-15.48 51.29zM192.77 106.76l19-26.44c-14.3-5.32-32.06-9.35-50.33-6.95-20.92 2.75-42.78 14.03-61.31 41.73-1.69 2.53-5.11 3.2-7.64 1.51a5.494 5.494 0 0 1-2.39-5.38c1.59-10.85 4.5-20.52 8.43-29.09 11.6-25.29 31.98-40.71 54.39-49.05 22.12-8.24 46.22-9.55 65.64-6.68 6.74 1 12.98 2.52 18.42 4.43l8.11-26.9a5.524 5.524 0 0 1 6.87-3.71c1.76.52 3.06 1.84 3.63 3.45l35.53 82.09c1.2 2.79-.08 6.04-2.87 7.24l-.85.29-89.02 22.32a5.527 5.527 0 0 1-6.7-4.01c-.44-1.77.02-3.54 1.09-4.85zM65.43 359.24c-12.84 0-24.14-2.09-33.97-6.33-9.77-4.24-17.51-10.69-23.1-19.29C2.76 324.96 0 313.96 0 300.63c0-11 1.84-20.39 5.59-28.26 3.81-7.8 9.03-14.19 15.73-19.17 6.76-4.97 14.56-8.72 23.53-11.36 8.9-2.65 18.61-4.3 28.99-5.1 11.25-.86 20.27-1.97 27.16-3.2 6.82-1.29 11.79-3.07 14.86-5.4 3.01-2.28 4.55-5.35 4.55-9.22v-.49c0-5.28-2.03-9.27-6.02-12.1-3.99-2.76-9.15-4.18-15.42-4.18-6.94 0-12.53 1.54-16.83 4.55-4.3 3.01-6.95 7.61-7.8 13.82H7.86c.86-12.22 4.74-23.53 11.67-33.85 6.95-10.38 17.08-18.61 30.48-24.88 13.33-6.27 29.98-9.34 50-9.34 14.38 0 27.28 1.66 38.71 5.04 11.49 3.32 21.19 7.99 29.24 14.01 7.99 5.96 14.13 12.96 18.37 20.95 4.24 7.98 6.33 16.64 6.33 25.98V356.1h-67.52v-28.25h-1.6c-3.99 7.49-8.84 13.57-14.56 18.18-5.71 4.61-12.22 7.98-19.53 10.07-7.25 2.09-15.3 3.14-24.02 3.14zm50.93-58.8c3.07-4.23 4.6-9.46 4.6-15.54v-16.77c-9.35 3.79-18.84 5.82-28.81 7.31-11.7 1.93-24.08 7.22-24.08 20.95 0 5.59 1.97 9.89 5.9 12.84 12.5 9.38 33.63 3.46 42.39-8.79zm285.18-50.12-26.72-88.47h-2.09l-26.69 88.47h55.5z"/></svg>',
  //     title: "Case",
  //   },
  // },
  changeCase: {
    class: ChangeCase,
    config: {},
  },
  header: {
    class: Header,
    config: {
      placeholder: "Enter a header",
      levels: [1, 2, 3],
      defaultLevel: 1,
    },
  },
  list: {
    class: List,
    inlineToolbar: true,
    config: {
      defaultStyle: "unordered",
    },
  },
  callout: {
    class: Callout,
    toolbox: {
      icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 	 viewBox="0 0 800 800" style="enable-background:new 0 0 800 800;" xml:space="preserve"> <g id="Page-1"> 	<g id="ic-message-type"> 		<path id="Oval-1" d="M256.9,644.2l-102.6,25.4v-85.2c-56.7-48.5-91.9-114.2-91.9-188.3c0-154.8,153.9-273.5,336.9-273.5 			s336.9,118.7,336.9,273.5S582.2,669.6,399.3,669.6C348.7,669.6,300.3,660.6,256.9,644.2z M399.3,608.8 			c152.2,0,275.6-95.3,275.6-212.7S551.5,183.4,399.3,183.4s-275.6,95.2-275.6,212.7S247,608.8,399.3,608.8z M399.3,426.5 			c-16.9,0-30.6-13.6-30.6-30.4s13.7-30.4,30.6-30.4s30.6,13.6,30.6,30.4S416.2,426.5,399.3,426.5z M276.8,426.5 			c-16.9,0-30.6-13.6-30.6-30.4s13.7-30.4,30.6-30.4c16.9,0,30.6,13.6,30.6,30.4S293.7,426.5,276.8,426.5z M521.7,426.5 			c-16.9,0-30.6-13.6-30.6-30.4s13.7-30.4,30.6-30.4c16.9,0,30.6,13.6,30.6,30.4C552.4,412.9,538.6,426.5,521.7,426.5z"/> 	</g> </g> </svg>',
      title: "Callout",
    },
  },
  quote: Quote,
  checklist: CheckList,
  code: {
    class: CodeBlock,
    config: {
      // Set field to initially render with value each time it is loaded
      data: {},
      // Set field to initially render with value only on creation
      dataDefaults: {},
    },
    // toolbox: {
    //   icon: '<svg fill="#000000" width="800px" height="800px" viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"> <rect id="Icons" x="-768" y="0" width="1280" height="800" style="fill:none;"/> <g id="Icons1" serif:id="Icons"> <g id="Strike"> </g> <g id="H1"> </g> <g id="H2"> </g> <g id="H3"> </g> <g id="list-ul"> </g> <g id="hamburger-1"> </g> <g id="hamburger-2"> </g> <g id="list-ol"> </g> <g id="list-task"> </g> <g id="trash"> </g> <g id="vertical-menu"> </g> <g id="horizontal-menu"> </g> <g id="sidebar-2"> </g> <g id="Pen"> </g> <g id="Pen1" serif:id="Pen"> </g> <g id="clock"> </g> <g id="external-link"> </g> <g id="hr"> </g> <g id="info"> </g> <g id="warning"> </g> <g id="plus-circle"> </g> <g id="minus-circle"> </g> <g id="vue"> </g> <g id="cog"> </g> <g id="logo"> </g> <path id="code" d="M25.027,49.084l-16.97,-16.971l16.97,-16.97l2.829,2.828l-14.143,14.142c4.714,4.714 9.429,9.428 14.143,14.142l-2.829,2.829Zm30.986,-16.971l-16.97,16.971l-2.829,-2.829l14.142,-14.142l-14.142,-14.142l2.829,-2.828l16.97,16.97Z"/> <g id="radio-check"> </g> <g id="eye-slash"> </g> <g id="eye"> </g> <g id="toggle-off"> </g> <g id="shredder"> </g> <g id="spinner--loading--dots-" serif:id="spinner [loading, dots]"> </g> <g id="react"> </g> <g id="check-selected"> </g> <g id="turn-off"> </g> <g id="code-block"> </g> <g id="user"> </g> <g id="coffee-bean"> </g> <g id="coffee-beans"> <g id="coffee-bean1" serif:id="coffee-bean"> </g> </g> <g id="coffee-bean-filled"> </g> <g id="coffee-beans-filled"> <g id="coffee-bean2" serif:id="coffee-bean"> </g> </g> <g id="clipboard"> </g> <g id="clipboard-paste"> </g> <g id="clipboard-copy"> </g> <g id="Layer1"> </g> </g> </svg>',
    //   title: "Code",
    // },
  },
  simpleImage: {
    class: SimpleImage,
  }, // Add image by url paste
  urlImage: {
    // Open box with image url and unsplash
    class: InlineImage,
    inlineToolbar: true,
    toolbox: {
      icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 91.24" style="enable-background:new 0 0 122.88 91.24" xml:space="preserve"><g><path d="M6.23,0H116.7c1.72,0,3.25,0.7,4.37,1.81c1.11,1.11,1.81,2.69,1.81,4.37v78.88c0,1.72-0.7,3.25-1.81,4.37 c-0.09,0.09-0.19,0.19-0.33,0.28c-1.07,0.98-2.51,1.53-4.09,1.53H6.18c-1.72,0-3.25-0.7-4.37-1.81C0.7,88.32,0,86.74,0,85.06V6.18 c0-1.72,0.7-3.25,1.81-4.37S4.51,0,6.18,0L6.23,0L6.23,0L6.23,0z M31.74,21.42c4.9,0,8.87,3.97,8.87,8.86 c0,4.9-3.97,8.87-8.87,8.87s-8.87-3.97-8.87-8.87C22.87,25.39,26.84,21.42,31.74,21.42L31.74,21.42L31.74,21.42z M69.05,59.46 l17.73-30.66l18.84,47.65l-87.92,0v-5.91l7.39-0.37l7.39-18.1l3.69,12.93h11.08l9.6-24.75L69.05,59.46L69.05,59.46L69.05,59.46z M115.54,7.34H7.39v76.51h108.15L115.54,7.34L115.54,7.34L115.54,7.34z"/></g></svg>',
      title: "Image (url)",
    },
    config: {
      embed: {
        display: true,
      },
      unsplash: {
        appName: "tech_blog",
        clientId: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
        maxResults: "12",
      },
    },
  },
  uploadImage: {
    class: ImageTool,
    toolbox: {
      icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 91.24" style="enable-background:new 0 0 122.88 91.24" xml:space="preserve"><g><path d="M6.23,0H116.7c1.72,0,3.25,0.7,4.37,1.81c1.11,1.11,1.81,2.69,1.81,4.37v78.88c0,1.72-0.7,3.25-1.81,4.37 c-0.09,0.09-0.19,0.19-0.33,0.28c-1.07,0.98-2.51,1.53-4.09,1.53H6.18c-1.72,0-3.25-0.7-4.37-1.81C0.7,88.32,0,86.74,0,85.06V6.18 c0-1.72,0.7-3.25,1.81-4.37S4.51,0,6.18,0L6.23,0L6.23,0L6.23,0z M31.74,21.42c4.9,0,8.87,3.97,8.87,8.86 c0,4.9-3.97,8.87-8.87,8.87s-8.87-3.97-8.87-8.87C22.87,25.39,26.84,21.42,31.74,21.42L31.74,21.42L31.74,21.42z M69.05,59.46 l17.73-30.66l18.84,47.65l-87.92,0v-5.91l7.39-0.37l7.39-18.1l3.69,12.93h11.08l9.6-24.75L69.05,59.46L69.05,59.46L69.05,59.46z M115.54,7.34H7.39v76.51h108.15L115.54,7.34L115.54,7.34L115.54,7.34z"/></g></svg>',
      title: "Image (upload)",
    },
    config: {
      uploader: {
        async uploadByFile(file) {
          try {
            // Create filename
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hour = String(date.getHours()).padStart(2, "0");
            const minute = String(date.getMinutes()).padStart(2, "0");
            const second = String(date.getSeconds()).padStart(2, "0");
            const extension = file.name.split(".").pop();
            const fileName =
              `${year}-${month}-${day}.${hour}${minute}${second}` +
              "." +
              extension;
            let imageRef = ref(cloudStorage, "Images/" + fileName);
            let metadata = {
              contentType: "image/jpeg",
            };
            let uploadTask = await uploadBytes(imageRef, file, metadata);
            const downloadURL = await getDownloadURL(uploadTask.ref);
            return {
              success: 1,
              file: {
                url: downloadURL,
              },
            };
          } catch (error) {
            console.log(error);
          }
        },
      },
    },
  },
  divider: Divider,
  video: InlineVideo,
  embed: Embed,
  iframe: Iframe,
  linkTool: {
    class: LinkTool,
    config: {
      endpoint: process.env.NEXT_PUBLIC_SERVER_URL + "/editorjs/linkpreview", // Your backend endpoint for url data fetching,
    },
  },
  table: {
    class: Table,
    inlineToolbar: true,
    config: {
      withHeadings: true,
      rows: 2,
      cols: 2,
    },
  },
  math: {
    // @ts-ignore
    class: EJLaTeX,
    shortcut: "CMD+SHIFT+E",
    toolbox: {
      icon: '<svg fill="#000000" width="800px" height="800px" viewBox="0 0 1024 1024" t="1569683610100" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12238" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css"></style></defs><path d="M841 370c3-3.3 2.7-8.3-0.6-11.3-1.5-1.3-3.4-2.1-5.3-2.1h-72.6c-2.4 0-4.6 1-6.1 2.8L633.5 504.6c-2.9 3.4-7.9 3.8-11.3 0.9-0.9-0.8-1.6-1.7-2.1-2.8l-63.5-141.3c-1.3-2.9-4.1-4.7-7.3-4.7H380.7l0.9-4.7 8-42.3c10.5-55.4 38-81.4 85.8-81.4 18.6 0 35.5 1.7 48.8 4.7l14.1-66.8c-22.6-4.7-35.2-6.1-54.9-6.1-103.3 0-156.4 44.3-175.9 147.3l-9.4 49.4h-97.6c-3.8 0-7.1 2.7-7.8 6.4L181.9 415c-0.9 4.3 1.9 8.6 6.2 9.5 0.5 0.1 1.1 0.2 1.6 0.2H284l-89 429.9c-0.9 4.3 1.9 8.6 6.2 9.5 0.5 0.1 1.1 0.2 1.6 0.2H269c3.8 0 7.1-2.7 7.8-6.4l89.7-433.1h135.8l68.2 139.1c1.4 2.9 1 6.4-1.2 8.8l-180.6 203c-2.9 3.3-2.6 8.4 0.7 11.3 1.5 1.3 3.4 2 5.3 2h72.7c2.4 0 4.6-1 6.1-2.8l123.7-146.7c2.8-3.4 7.9-3.8 11.3-1 0.9 0.8 1.6 1.7 2.1 2.8L676.4 784c1.3 2.8 4.1 4.7 7.3 4.7h64.6c4.4 0 8-3.6 8-8 0-1.2-0.3-2.4-0.8-3.5l-95.2-198.9c-1.4-2.9-0.9-6.4 1.3-8.8L841 370z" p-id="12239"></path></svg>',
      title: "Math",
    },
  },
  toggle: {
    class: ToggleBlock,
    inlineToolbar: true,
  },
};
export default EDITOR_JS_TOOLS;
