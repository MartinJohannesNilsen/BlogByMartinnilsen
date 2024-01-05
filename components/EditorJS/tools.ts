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
import ChangeCase from "./BlockTools/ChangeCase/change-case";

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
    inlineToolbar: true,
    toolbox: {
      // icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 	 viewBox="0 0 800 800" style="enable-background:new 0 0 800 800;" xml:space="preserve"> <g id="Page-1"> 	<g id="ic-message-type"> 		<path id="Oval-1" d="M256.9,644.2l-102.6,25.4v-85.2c-56.7-48.5-91.9-114.2-91.9-188.3c0-154.8,153.9-273.5,336.9-273.5 			s336.9,118.7,336.9,273.5S582.2,669.6,399.3,669.6C348.7,669.6,300.3,660.6,256.9,644.2z M399.3,608.8 			c152.2,0,275.6-95.3,275.6-212.7S551.5,183.4,399.3,183.4s-275.6,95.2-275.6,212.7S247,608.8,399.3,608.8z M399.3,426.5 			c-16.9,0-30.6-13.6-30.6-30.4s13.7-30.4,30.6-30.4s30.6,13.6,30.6,30.4S416.2,426.5,399.3,426.5z M276.8,426.5 			c-16.9,0-30.6-13.6-30.6-30.4s13.7-30.4,30.6-30.4c16.9,0,30.6,13.6,30.6,30.4S293.7,426.5,276.8,426.5z M521.7,426.5 			c-16.9,0-30.6-13.6-30.6-30.4s13.7-30.4,30.6-30.4c16.9,0,30.6,13.6,30.6,30.4C552.4,412.9,538.6,426.5,521.7,426.5z"/> 	</g> </g> </svg>',
      icon: '<svg width="218px" height="218px" viewBox="-4.48 -4.48 36.96 36.96" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="0.56"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M26.001 7.35334C26.001 5.54646 24.2882 4.23059 22.5423 4.69622L4.04572 9.62939C2.84195 9.95045 2.00439 11.0407 2.00439 12.2865V15.7136C2.00439 16.9594 2.84195 18.0496 4.04572 18.3707L7 19.1586V19.5C7 21.9853 9.01472 24 11.5 24C13.2899 24 14.8357 22.955 15.5606 21.4418L22.5423 23.3039C24.2882 23.7695 26.001 22.4536 26.001 20.6468V7.35334ZM22.9289 6.14556C23.7225 5.93391 24.501 6.53203 24.501 7.35334V20.6468C24.501 21.4681 23.7225 22.0662 22.9289 21.8545L4.43227 16.9214C3.8851 16.7754 3.50439 16.2799 3.50439 15.7136V12.2865C3.50439 11.7202 3.8851 11.2247 4.43227 11.0787L22.9289 6.14556ZM14.0722 21.0448C13.5474 21.9167 12.5918 22.5 11.5 22.5C9.8628 22.5 8.53192 21.1885 8.50057 19.5588L14.0722 21.0448Z" fill="#212121"></path> </g></svg>',
      title: "Callout",
    },
  },
  quote: Quote,
  checklist: {
    class: CheckList,
    toolbox: {
      icon: `<svg width="225px" height="225px" viewBox="-2.64 -2.64 29.28 29.28" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Checkbox_Check"> <path id="Vector" d="M8 12L11 15L16 9M4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4796 4 18.9074 4.21799C19.2837 4.40973 19.5905 4.71547 19.7822 5.0918C20 5.5192 20 6.07899 20 7.19691V16.8036C20 17.9215 20 18.4805 19.7822 18.9079C19.5905 19.2842 19.2837 19.5905 18.9074 19.7822C18.48 20 17.921 20 16.8031 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002Z" stroke="#000000" stroke-width="1.512" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>`,
    },
  },
  code: {
    class: CodeBlock,
    config: {
      // Set field to initially render with value each time it is loaded
      data: {},
      // Set field to initially render with value only on creation
      dataDefaults: {},
    },
    toolbox: {
      icon: '<svg viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 8L5 11.6923L9 16M15 8L19 11.6923L15 16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',
      title: "Code",
    },
  },
  simpleImage: {
    class: SimpleImage,
  }, // Add image by url paste
  urlImage: {
    // Open box with image url and unsplash
    class: InlineImage,
    inlineToolbar: true,
    toolbox: {
      // icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 91.24" style="enable-background:new 0 0 122.88 91.24" xml:space="preserve"><g><path d="M6.23,0H116.7c1.72,0,3.25,0.7,4.37,1.81c1.11,1.11,1.81,2.69,1.81,4.37v78.88c0,1.72-0.7,3.25-1.81,4.37 c-0.09,0.09-0.19,0.19-0.33,0.28c-1.07,0.98-2.51,1.53-4.09,1.53H6.18c-1.72,0-3.25-0.7-4.37-1.81C0.7,88.32,0,86.74,0,85.06V6.18 c0-1.72,0.7-3.25,1.81-4.37S4.51,0,6.18,0L6.23,0L6.23,0L6.23,0z M31.74,21.42c4.9,0,8.87,3.97,8.87,8.86 c0,4.9-3.97,8.87-8.87,8.87s-8.87-3.97-8.87-8.87C22.87,25.39,26.84,21.42,31.74,21.42L31.74,21.42L31.74,21.42z M69.05,59.46 l17.73-30.66l18.84,47.65l-87.92,0v-5.91l7.39-0.37l7.39-18.1l3.69,12.93h11.08l9.6-24.75L69.05,59.46L69.05,59.46L69.05,59.46z M115.54,7.34H7.39v76.51h108.15L115.54,7.34L115.54,7.34L115.54,7.34z"/></g></svg>',
      icon: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 800 800" style="enable-background:new 0 0 800 800;" xml:space="preserve">
   <g id="SVGRepo_bgCarrier">
   </g>
   <g id="SVGRepo_tracerCarrier">
   </g>
   <g id="SVGRepo_iconCarrier">
     <path d="M591.7,422.5c-12.4,0-22.5,10.1-22.5,22.5v8.6l-33.3-33.3c-24.5-24.3-64-24.3-88.5,0L431.6,436l-55.9-55.9
       c-24.8-23.6-63.7-23.6-88.5,0l-33.3,33.3V287.4c0-12.4,10.1-22.5,22.5-22.5h157.7c12.4,0,22.5-10.1,22.5-22.5
       c0-12.4-10.1-22.5-22.5-22.5H276.4c-37.3,0-67.6,30.3-67.6,67.6v270.3c0,37.3,30.3,67.6,67.6,67.6h270.3
       c37.3,0,67.6-30.3,67.6-67.6V445C614.3,432.6,604.2,422.5,591.7,422.5z M276.4,580.2c-12.4,0-22.5-10.1-22.5-22.5v-80.4l65.3-65.3
       c6.9-6.5,17.7-6.5,24.5,0l71.4,71.4l0,0l96.8,96.8H276.4z M569.2,557.7c0,4.3-1.5,8.5-4.1,11.9l-101.6-102l15.8-15.8
       c6.7-6.8,17.7-7,24.5-0.3c0.1,0.1,0.2,0.2,0.3,0.3l65.1,65.5V557.7z"/>
     <g id="SVGRepo_iconCarrier_00000147907244798165187050000008612513060623724674_">
       <path d="M420.6,264.9h126.1c12.4,0,22.5,10.1,22.5,22.5V445c0,12.4,10.1,22.5,22.5,22.5c12.4,0,22.5-10.1,22.5-22.5V287.4
         c0-37.3-30.3-67.6-67.6-67.6H386.3c-37.3,0-29.4,7.7-29.4,45 M366.5,474.5"/>
     </g>
   </g>
   </svg>`,
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
      // icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 91.24" style="enable-background:new 0 0 122.88 91.24" xml:space="preserve"><g><path d="M6.23,0H116.7c1.72,0,3.25,0.7,4.37,1.81c1.11,1.11,1.81,2.69,1.81,4.37v78.88c0,1.72-0.7,3.25-1.81,4.37 c-0.09,0.09-0.19,0.19-0.33,0.28c-1.07,0.98-2.51,1.53-4.09,1.53H6.18c-1.72,0-3.25-0.7-4.37-1.81C0.7,88.32,0,86.74,0,85.06V6.18 c0-1.72,0.7-3.25,1.81-4.37S4.51,0,6.18,0L6.23,0L6.23,0L6.23,0z M31.74,21.42c4.9,0,8.87,3.97,8.87,8.86 c0,4.9-3.97,8.87-8.87,8.87s-8.87-3.97-8.87-8.87C22.87,25.39,26.84,21.42,31.74,21.42L31.74,21.42L31.74,21.42z M69.05,59.46 l17.73-30.66l18.84,47.65l-87.92,0v-5.91l7.39-0.37l7.39-18.1l3.69,12.93h11.08l9.6-24.75L69.05,59.46L69.05,59.46L69.05,59.46z M115.54,7.34H7.39v76.51h108.15L115.54,7.34L115.54,7.34L115.54,7.34z"/></g></svg>',
      // icon: '<svg fill="#000000" viewBox="-5.76 -5.76 35.52 35.52" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.048"></g><g id="SVGRepo_iconCarrier"><path d="M19,13a1,1,0,0,0-1,1v.38L16.52,12.9a2.79,2.79,0,0,0-3.93,0l-.7.7L9.41,11.12a2.85,2.85,0,0,0-3.93,0L4,12.6V7A1,1,0,0,1,5,6h7a1,1,0,0,0,0-2H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V14A1,1,0,0,0,19,13ZM5,20a1,1,0,0,1-1-1V15.43l2.9-2.9a.79.79,0,0,1,1.09,0l3.17,3.17,0,0L15.46,20Zm13-1a.89.89,0,0,1-.18.53L13.31,15l.7-.7a.77.77,0,0,1,1.1,0L18,17.21ZM22.71,4.29l-3-3a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-3,3a1,1,0,0,0,1.42,1.42L18,4.41V10a1,1,0,0,0,2,0V4.41l1.29,1.3a1,1,0,0,0,1.42,0A1,1,0,0,0,22.71,4.29Z"></path></g></svg>',
      icon: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 800 800" style="enable-background:new 0 0 800 800;" xml:space="preserve">
   <g id="SVGRepo_bgCarrier">
   </g>
   <g id="SVGRepo_tracerCarrier">
   </g>
   <g id="SVGRepo_iconCarrier">
     <path d="M598.7,422.5c-12.4,0-22.5,10.1-22.5,22.5v8.6l-33.3-33.3c-24.5-24.3-64-24.3-88.5,0L438.5,436l-55.9-55.9
       c-24.8-23.6-63.7-23.6-88.5,0l-33.3,33.3V287.4c0-12.4,10.1-22.5,22.5-22.5H441c12.4,0,22.5-10.1,22.5-22.5
       c0-12.4-10.1-22.5-22.5-22.5H283.3c-37.3,0-67.6,30.3-67.6,67.6v270.3c0,37.3,30.3,67.6,67.6,67.6h270.3
       c37.3,0,67.6-30.3,67.6-67.6V445C621.2,432.6,611.1,422.5,598.7,422.5z M283.3,580.2c-12.4,0-22.5-10.1-22.5-22.5v-80.4l65.3-65.3
       c6.9-6.5,17.7-6.5,24.5,0l71.4,71.4l0,0l96.8,96.8H283.3z M576.1,557.7c0,4.3-1.5,8.5-4.1,11.9l-101.6-102l15.8-15.8
       c6.7-6.8,17.7-7,24.5-0.3c0.1,0.1,0.2,0.2,0.3,0.3l65.1,65.5V557.7z M682.2,226.4l-67.6-67.6c-2.1-2.1-4.7-3.7-7.4-4.7
       c-5.5-2.3-11.6-2.3-17.1,0c-2.8,1.1-5.3,2.7-7.4,4.7l-67.6,67.6c-8.8,8.8-8.8,23.2,0,32c8.8,8.8,23.2,8.8,32,0l29.1-29.3V355
       c0,12.4,10.1,22.5,22.5,22.5s22.5-10.1,22.5-22.5V229.1l29.1,29.3c8.8,8.8,23,8.9,31.9,0.1c0,0,0.1-0.1,0.1-0.1
       c8.8-8.8,8.9-23,0.1-31.9C682.3,226.4,682.3,226.4,682.2,226.4z"/>
   </g>
   </svg>`,
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
  divider: {
    class: Divider,
    toolbox: {
      // icon: `<svg width="219px" height="219px" viewBox="-1.95 -1.95 18.90 18.90" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="0.00015000000000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M2 7.5C2 7.22386 2.22386 7 2.5 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H2.5C2.22386 8 2 7.77614 2 7.5Z" fill="#000000"></path> </g></svg>`,
      icon: `<svg width="217px" height="217px" viewBox="-3 -3 21.00 21.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="0.28500000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M2 7.5C2 7.22386 2.22386 7 2.5 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H2.5C2.22386 8 2 7.77614 2 7.5Z" fill="#000000"></path> </g></svg>`,
    },
  },
  video: InlineVideo,
  embed: Embed,
  iframe: Iframe,
  linkTool: {
    class: LinkTool,
    config: {
      endpoint: process.env.NEXT_PUBLIC_SERVER_URL + "/editorjs/linkpreview", // Your backend endpoint for url data fetching,
    },
    toolbox: {
      // icon: `<svg width="222px" height="222px" viewBox="-3.6 -3.6 31.20 31.20" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.16488 17.6505C8.92513 17.8743 8.73958 18.0241 8.54996 18.1336C7.62175 18.6695 6.47816 18.6695 5.54996 18.1336C5.20791 17.9361 4.87912 17.6073 4.22153 16.9498C3.56394 16.2922 3.23514 15.9634 3.03767 15.6213C2.50177 14.6931 2.50177 13.5495 3.03767 12.6213C3.23514 12.2793 3.56394 11.9505 4.22153 11.2929L7.04996 8.46448C7.70755 7.80689 8.03634 7.47809 8.37838 7.28062C9.30659 6.74472 10.4502 6.74472 11.3784 7.28061C11.7204 7.47809 12.0492 7.80689 12.7068 8.46448C13.3644 9.12207 13.6932 9.45086 13.8907 9.7929C14.4266 10.7211 14.4266 11.8647 13.8907 12.7929C13.7812 12.9825 13.6314 13.1681 13.4075 13.4078M10.5919 10.5922C10.368 10.8319 10.2182 11.0175 10.1087 11.2071C9.57284 12.1353 9.57284 13.2789 10.1087 14.2071C10.3062 14.5492 10.635 14.878 11.2926 15.5355C11.9502 16.1931 12.279 16.5219 12.621 16.7194C13.5492 17.2553 14.6928 17.2553 15.621 16.7194C15.9631 16.5219 16.2919 16.1931 16.9495 15.5355L19.7779 12.7071C20.4355 12.0495 20.7643 11.7207 20.9617 11.3787C21.4976 10.4505 21.4976 9.30689 20.9617 8.37869C20.7643 8.03665 20.4355 7.70785 19.7779 7.05026C19.1203 6.39267 18.7915 6.06388 18.4495 5.8664C17.5212 5.3305 16.3777 5.3305 15.4495 5.8664C15.2598 5.97588 15.0743 6.12571 14.8345 6.34955" stroke="#000000" stroke-width="1.584" stroke-linecap="round"></path> </g></svg>`,
      // icon: `<svg viewBox="-6.72 -6.72 37.44 37.44" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.16488 17.6505C8.92513 17.8743 8.73958 18.0241 8.54996 18.1336C7.62175 18.6695 6.47816 18.6695 5.54996 18.1336C5.20791 17.9361 4.87912 17.6073 4.22153 16.9498C3.56394 16.2922 3.23514 15.9634 3.03767 15.6213C2.50177 14.6931 2.50177 13.5495 3.03767 12.6213C3.23514 12.2793 3.56394 11.9505 4.22153 11.2929L7.04996 8.46448C7.70755 7.80689 8.03634 7.47809 8.37838 7.28062C9.30659 6.74472 10.4502 6.74472 11.3784 7.28061C11.7204 7.47809 12.0492 7.80689 12.7068 8.46448C13.3644 9.12207 13.6932 9.45086 13.8907 9.7929C14.4266 10.7211 14.4266 11.8647 13.8907 12.7929C13.7812 12.9825 13.6314 13.1681 13.4075 13.4078M10.5919 10.5922C10.368 10.8319 10.2182 11.0175 10.1087 11.2071C9.57284 12.1353 9.57284 13.2789 10.1087 14.2071C10.3062 14.5492 10.635 14.878 11.2926 15.5355C11.9502 16.1931 12.279 16.5219 12.621 16.7194C13.5492 17.2553 14.6928 17.2553 15.621 16.7194C15.9631 16.5219 16.2919 16.1931 16.9495 15.5355L19.7779 12.7071C20.4355 12.0495 20.7643 11.7207 20.9617 11.3787C21.4976 10.4505 21.4976 9.30689 20.9617 8.37869C20.7643 8.03665 20.4355 7.70785 19.7779 7.05026C19.1203 6.39267 18.7915 6.06388 18.4495 5.8664C17.5212 5.3305 16.3777 5.3305 15.4495 5.8664C15.2598 5.97588 15.0743 6.12571 14.8345 6.34955" stroke="#000000" stroke-width="2.112" stroke-linecap="round"></path> </g></svg>`,
      icon: `<svg viewBox="-4.56 -4.56 33.12 33.12" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.16488 17.6505C8.92513 17.8743 8.73958 18.0241 8.54996 18.1336C7.62175 18.6695 6.47816 18.6695 5.54996 18.1336C5.20791 17.9361 4.87912 17.6073 4.22153 16.9498C3.56394 16.2922 3.23514 15.9634 3.03767 15.6213C2.50177 14.6931 2.50177 13.5495 3.03767 12.6213C3.23514 12.2793 3.56394 11.9505 4.22153 11.2929L7.04996 8.46448C7.70755 7.80689 8.03634 7.47809 8.37838 7.28062C9.30659 6.74472 10.4502 6.74472 11.3784 7.28061C11.7204 7.47809 12.0492 7.80689 12.7068 8.46448C13.3644 9.12207 13.6932 9.45086 13.8907 9.7929C14.4266 10.7211 14.4266 11.8647 13.8907 12.7929C13.7812 12.9825 13.6314 13.1681 13.4075 13.4078M10.5919 10.5922C10.368 10.8319 10.2182 11.0175 10.1087 11.2071C9.57284 12.1353 9.57284 13.2789 10.1087 14.2071C10.3062 14.5492 10.635 14.878 11.2926 15.5355C11.9502 16.1931 12.279 16.5219 12.621 16.7194C13.5492 17.2553 14.6928 17.2553 15.621 16.7194C15.9631 16.5219 16.2919 16.1931 16.9495 15.5355L19.7779 12.7071C20.4355 12.0495 20.7643 11.7207 20.9617 11.3787C21.4976 10.4505 21.4976 9.30689 20.9617 8.37869C20.7643 8.03665 20.4355 7.70785 19.7779 7.05026C19.1203 6.39267 18.7915 6.06388 18.4495 5.8664C17.5212 5.3305 16.3777 5.3305 15.4495 5.8664C15.2598 5.97588 15.0743 6.12571 14.8345 6.34955" stroke="#000000" stroke-width="2.4" stroke-linecap="round"></path> </g></svg>`,
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
    toolbox: {
      // icon: `<svg width="215px" height="215px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 9.5H20M4 14.5H20M9 4.5V19.5M7.2 19.5H16.8C17.9201 19.5 18.4802 19.5 18.908 19.282C19.2843 19.0903 19.5903 18.7843 19.782 18.408C20 17.9802 20 17.4201 20 16.3V7.7C20 6.5799 20 6.01984 19.782 5.59202C19.5903 5.21569 19.2843 4.90973 18.908 4.71799C18.4802 4.5 17.9201 4.5 16.8 4.5H7.2C6.0799 4.5 5.51984 4.5 5.09202 4.71799C4.71569 4.90973 4.40973 5.21569 4.21799 5.59202C4 6.01984 4 6.57989 4 7.7V16.3C4 17.4201 4 17.9802 4.21799 18.408C4.40973 18.7843 4.71569 19.0903 5.09202 19.282C5.51984 19.5 6.07989 19.5 7.2 19.5Z" stroke="#000000" stroke-width="1.272"></path> </g></svg>`,
      icon: `<svg viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 9.5H20M4 14.5H20M9 4.5V19.5M7.2 19.5H16.8C17.9201 19.5 18.4802 19.5 18.908 19.282C19.2843 19.0903 19.5903 18.7843 19.782 18.408C20 17.9802 20 17.4201 20 16.3V7.7C20 6.5799 20 6.01984 19.782 5.59202C19.5903 5.21569 19.2843 4.90973 18.908 4.71799C18.4802 4.5 17.9201 4.5 16.8 4.5H7.2C6.0799 4.5 5.51984 4.5 5.09202 4.71799C4.71569 4.90973 4.40973 5.21569 4.21799 5.59202C4 6.01984 4 6.57989 4 7.7V16.3C4 17.4201 4 17.9802 4.21799 18.408C4.40973 18.7843 4.71569 19.0903 5.09202 19.282C5.51984 19.5 6.07989 19.5 7.2 19.5Z" stroke="#000000" stroke-width="1.392"></path> </g></svg>`,
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
    toolbox: {
      icon: `<svg width="256px" height="256px" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 10.5L12.5 15L8 10.5" stroke="#121923" stroke-width="1.625"></path> </g></svg>`,
    },
  },
};
export default EDITOR_JS_TOOLS;
