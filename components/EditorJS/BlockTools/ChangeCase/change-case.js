/**
* @file Change Case Tool for the Editor.js - Allows to change selected text case in the block.
* @author Bakhtiar Amaludin <github.com/maziyank>
*/
import { lowerCase, sentenceCase, titleCase, toggleCase, upperCase } from "@/components/EditorJS/BlockTools/ChangeCase/change-case-util";

export default class ChangeCase {

    static get isInline() {
        return true;
    }

    get state() {
        return this._state;
    }

    constructor({ config, api }) {
        this.api = api;
        this.button = null;
        this.optionButtons = [];
        this._state = true;
        this.selectedText = null;
        this.range = null;
        this._settings = config;

        this.CSS = {
            actions: 'change-case-action',
            toolbarLabel: 'change-case-toolbar__label',
            tool: 'change-case-tool',
            toolbarBtnActive: this.api.styles.settingsButtonActive,
            inlineButton: this.api.styles.inlineToolButton
        };

        this.caseOptions = {
            'lowerCase': 'lower case',
            'upperCase': 'UPPER CASE',
            'sentenceCase': 'Sentence case',
            'titleCase': 'Title Case',
            'toggleCase': 'tOGGLE cASE'
        }
    }

    set state(state) {
        this._state = state;
        this.button.classList.toggle(this.CSS.toolbarBtnActive, state);
    }

    get title() {
        return 'Change Case';
    }

    render() {
        this.button = document.createElement('button');
        this.button.type = 'button';
        // this.button.innerHTML = `<svg width="220px" height="220px" viewBox="-3.2 -3.2 22.40 22.40" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.495 9.052l.891 2.35h1.091L6.237 3h-1.02L2 11.402h1.095l.838-2.35h3.562zM5.811 4.453l.044.135 1.318 3.574H4.255l1.307-3.574.044-.135.038-.156.032-.152.021-.126h.023l.024.126.029.152.038.156zm7.984 6.011v.936h.96V7.498c0-.719-.18-1.272-.539-1.661-.359-.389-.889-.583-1.588-.583-.199 0-.401.019-.606.056a4.875 4.875 0 0 0-1.078.326 2.081 2.081 0 0 0-.343.188v.984c.266-.23.566-.411.904-.54a2.927 2.927 0 0 1 1.052-.193c.188 0 .358.028.513.085a.98.98 0 0 1 .396.267c.109.121.193.279.252.472.059.193.088.427.088.7l-1.811.252c-.344.047-.64.126-.888.237a1.947 1.947 0 0 0-.615.419 1.6 1.6 0 0 0-.36.58 2.134 2.134 0 0 0-.117.721c0 .246.042.475.124.688.082.213.203.397.363.551.16.154.36.276.598.366.238.09.513.135.826.135.402 0 .76-.092 1.075-.278.315-.186.572-.454.771-.806h.023zm-2.128-1.743c.176-.064.401-.114.674-.149l1.465-.205v.609c0 .246-.041.475-.123.688a1.727 1.727 0 0 1-.343.557 1.573 1.573 0 0 1-.524.372 1.63 1.63 0 0 1-.668.135c-.187 0-.353-.025-.495-.076a1.03 1.03 0 0 1-.357-.211.896.896 0 0 1-.22-.316A1.005 1.005 0 0 1 11 9.732a1.6 1.6 0 0 1 .055-.44.739.739 0 0 1 .202-.334 1.16 1.16 0 0 1 .41-.237z"></path></g></svg>`;
        this.button.innerHTML = `
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 220 220" style="enable-background:new 0 0 220 220;" xml:space="preserve">
        <style type="text/css">
            .st0{fill-rule:evenodd;clip-rule:evenodd;}
            .st1{fill:#231F20;}
        </style>
        <g id="SVGRepo_bgCarrier">
        </g>
        <g id="SVGRepo_tracerCarrier">
        </g>
        <g id="SVGRepo_iconCarrier">
            <g>
                <g>
                    <path class="st0" d="M146.4,155.6c-3.3,0-6.3-0.5-8.8-1.5c-2.6-1-4.7-2.3-6.5-4c-1.7-1.7-3.1-3.8-4-6.1c-0.9-2.3-1.3-4.9-1.3-7.5
                        c0-2.7,0.4-5.3,1.3-7.8c0.8-2.4,2.2-4.6,3.9-6.4c1.9-2,4.1-3.5,6.6-4.6c2.6-1.2,5.8-2,9.4-2.5l17.7-2.5c-0.1-2.4-0.3-4.4-0.8-6.1
                        c-0.6-1.9-1.4-3.4-2.4-4.5c-1-1.1-2.3-2-3.7-2.5c-1.5-0.6-3.1-0.8-4.9-0.8c0,0,0,0,0,0c-3.6,0-7.1,0.7-10.4,1.9
                        c-3.3,1.3-6.3,3.1-9,5.4l-1.7,1.5v-13l0.4-0.3c1.2-0.8,2.4-1.5,3.7-2.1c3.6-1.6,7.4-2.8,11.3-3.5c2.2-0.4,4.3-0.6,6.4-0.6
                        c7.4,0,13.2,2.2,17,6.4c3.8,4.2,5.8,10.3,5.8,18V154h-11.8v-7.7c-1.8,2.6-4.1,4.6-6.6,6.2C154.5,154.5,150.6,155.6,146.4,155.6z
                        M150.7,124.5c-2.7,0.4-5,0.9-6.7,1.5c-1.5,0.5-2.8,1.3-3.9,2.3c-0.8,0.8-1.5,1.9-1.8,3c-0.4,1.4-0.5,2.8-0.5,4.3
                        c0,1.3,0.2,2.6,0.7,3.7c0.5,1.1,1.1,2.1,2,2.9c1,0.9,2.1,1.6,3.3,2c1.3,0.5,2.9,0.7,4.7,0.7l0.2,0c2.2,0,4.3-0.4,6.2-1.3
                        c1.9-0.9,3.6-2.1,5-3.6c1.4-1.6,2.6-3.4,3.3-5.5c0.8-2.1,1.2-4.4,1.2-6.8v-5.2L150.7,124.5z M109.4,154l-9.1-24.5H65.2L56.6,154
                        H43.2l33.7-89.6h11.8l33.9,89.6H109.4z M96.2,118.3l-13-35.9l-0.5-1.4l-0.1-0.4l-0.1,0.3l-0.5,1.5l-12.9,36H96.2z"/>
                    <path class="st1" d="M88.1,65.4l33.2,87.6h-11.2l-9.1-24.5H64.5L55.9,153H44.7l33-87.6H88.1 M67.8,119.3h29.9L84.2,82l-0.5-1.4
                        L83.3,79L83,77.4l-0.2-1.3h-0.2l-0.2,1.3L82,79l-0.4,1.6L81.2,82L67.8,119.3 M153.5,88.9c7.2,0,12.6,2,16.3,6.1
                        c3.7,4.1,5.5,9.8,5.5,17.3V153h-9.8v-9.8h-0.2c-2,3.7-4.7,6.5-7.9,8.4c-3.2,1.9-6.9,2.9-11,2.9c-3.2,0-6-0.5-8.5-1.4
                        s-4.5-2.2-6.1-3.8c-1.6-1.6-2.9-3.5-3.7-5.7c-0.8-2.2-1.3-4.6-1.3-7.2c0-2.6,0.4-5.1,1.2-7.5c0.8-2.3,2-4.3,3.7-6
                        c1.8-1.9,3.9-3.3,6.3-4.4c2.5-1.2,5.6-2,9.1-2.5l18.6-2.6c0-2.8-0.3-5.3-0.9-7.3c-0.6-2-1.5-3.7-2.6-4.9
                        c-1.1-1.3-2.5-2.2-4.1-2.8c-1.6-0.6-3.3-0.9-5.3-0.9c0,0,0,0-0.1,0c-3.7,0-7.3,0.7-10.7,2c-3.5,1.3-6.5,3.2-9.3,5.6V94.9
                        c1.1-0.8,2.3-1.4,3.5-2c3.5-1.6,7.2-2.7,11-3.4C149.4,89.1,151.5,88.9,153.5,88.9 M148.8,146c2.3,0,4.6-0.5,6.7-1.4
                        c2-0.9,3.9-2.2,5.4-3.9c1.5-1.7,2.7-3.7,3.5-5.8c0.8-2.2,1.3-4.6,1.3-7.2v-6.3l-15,2.1c-2.8,0.4-5.1,0.9-6.9,1.6
                        c-1.6,0.5-3,1.4-4.2,2.5c-1,1-1.7,2.2-2.1,3.5c-0.4,1.5-0.6,3-0.6,4.6c0,1.4,0.3,2.8,0.8,4.1c0.5,1.3,1.3,2.4,2.3,3.3
                        c1.1,1,2.3,1.7,3.7,2.2c1.5,0.5,3.2,0.8,5.1,0.8C148.7,146,148.8,146,148.8,146 M89.5,63.4h-1.4H77.6h-1.4l-0.5,1.3l-33,87.6
                        l-1,2.7h2.9h11.2h1.4l0.5-1.3l8.1-23.2h33.7l8.6,23.2l0.5,1.3h1.4h11.2h2.9l-1-2.7L89.9,64.7L89.5,63.4L89.5,63.4z M70.6,117.3
                        l12-33.5l12.1,33.5H70.6L70.6,117.3z M153.5,86.9c-2.1,0-4.3,0.2-6.6,0.6c-3.9,0.7-7.8,1.9-11.5,3.5c-1.3,0.6-2.6,1.3-3.8,2.1
                        l-0.9,0.6v1.1v10.3v4.4l3.3-2.9c2.6-2.3,5.5-4,8.7-5.3c3.2-1.2,6.6-1.9,10-1.9l0.1,0c1.7,0,3.2,0.2,4.6,0.8
                        c1.3,0.5,2.4,1.2,3.3,2.2c0.9,1,1.6,2.4,2.2,4.2c0.4,1.4,0.7,3.1,0.8,5l-16.8,2.4c-3.7,0.5-6.9,1.4-9.6,2.6
                        c-2.6,1.1-4.9,2.7-6.9,4.8c-1.9,2-3.3,4.2-4.1,6.8c-0.9,2.7-1.3,5.4-1.3,8.2c0,2.8,0.5,5.4,1.4,7.9c0.9,2.5,2.4,4.7,4.2,6.5
                        c1.8,1.8,4.1,3.2,6.8,4.3c2.7,1,5.7,1.5,9.2,1.5c4.5,0,8.5-1.1,12-3.2c1.9-1.1,3.6-2.5,5.1-4.2v3.8v2h2h9.8h2v-2v-40.7
                        c0-8-2-14.2-6-18.7C167.2,89.2,161.3,86.9,153.5,86.9L153.5,86.9z M140.9,129c1-0.9,2.2-1.6,3.5-2l0,0l0,0
                        c1.7-0.6,3.8-1.1,6.5-1.4l12.7-1.8v4c0,2.3-0.4,4.5-1.1,6.5c-0.7,1.9-1.8,3.7-3.1,5.2c-1.3,1.5-2.9,2.6-4.7,3.4
                        c-1.9,0.8-3.8,1.2-5.8,1.2l-0.2,0c-1.7,0-3.2-0.2-4.4-0.7c-1.1-0.4-2.1-1-3-1.8c-0.7-0.7-1.4-1.6-1.8-2.6
                        c-0.4-1.1-0.6-2.2-0.6-3.3c0-1.4,0.1-2.8,0.5-4.1C139.6,130.6,140.2,129.7,140.9,129L140.9,129z"/>
                </g>
            </g>
        </g>
        </svg>`;
        this.button.classList.add(this.CSS.inlineButton);

        return this.button;
    }

    checkState(selection) {
        const text = selection.anchorNode;
        if (!text) return;
    }

    convertCase(range, option) {
        if (!range) return
        const clone = range.cloneContents();
        if (!clone) return
        clone.childNodes.forEach(node => {
            if (node.nodeName !== '#text') return;

            switch (option) {
                case 'titleCase':
                    node.textContent = titleCase(node.textContent);
                    break;

                case 'lowerCase':
                    node.textContent = lowerCase(node.textContent);
                    break;

                case 'upperCase':
                    node.textContent = upperCase(node.textContent);
                    break;

                case 'sentenceCase':
                    node.textContent = sentenceCase(node.textContent);
                    break;

                case 'toggleCase':
                    node.textContent = toggleCase(node.textContent);
                    break;

                default:
                    break;
            }
        });

        range.extractContents();
        range.insertNode(clone);
        this.api.inlineToolbar.close();
    }

    surround(range) {
        this.selectedText = range.cloneContents();
        this.actions.hidden = !this.actions.hidden;
        this.range = !this.actions.hidden ? range : null;
        this.state = !this.actions.hidden;
    }

    renderActions() {
        this.actions = document.createElement('div');
        this.actions.classList.add(this.CSS.actions);
        const actionsToolbar = document.createElement('div');
        actionsToolbar.classList.add(this.CSS.toolbarLabel);
        actionsToolbar.innerHTML = 'Change Case';

        this.actions.appendChild(actionsToolbar);

        if (!this._settings.showLocaleOption) {
            delete this.caseOptions.localeLowerCase;
            delete this.caseOptions.localeUpperCase;
        }        
        
        this.optionButtons = Object.keys(this.caseOptions).map(option => {
            const btnOption = document.createElement('div');
            btnOption.classList.add(this.CSS.tool);
            btnOption.dataset.mode = option;
            btnOption.innerHTML = this.caseOptions[option];
            return btnOption
        })

        for (const btnOption of this.optionButtons) {
            this.actions.appendChild(btnOption);
            this.api.listeners.on(btnOption, 'mousedown', () => {
                this.convertCase(this.range, btnOption.dataset.mode)
            });
        }

        this.actions.hidden = true;
        return this.actions;
    }

    destroy() {
        for (const btnOption of this.optionButtons) {
            this.api.listeners.off(btnOption, 'mousedown');
        }
    }
}

