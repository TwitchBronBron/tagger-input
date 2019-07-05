class TaggerInputElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    /**
     * Add a new tag to the tag list
     */
    addTag(tagName) {
        let tagElement = document.createElement('span');
        tagElement.innerHTML = `
            <span class="tag-name">${tagName}</span>
            &nbsp;&nbsp;
            <span class="delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg>
            </span>
        `;
        tagElement.getElementsByClassName('delete')[0].addEventListener('click', () => {
            this.tagContainer.removeChild(tagElement);
        });
        this.tagContainer.appendChild(tagElement);
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    box-sizing: border-box;
                    display: block;
                    border: 1px solid rgb(238, 238, 238);
                    border-style: inset;
                    cursor: text;
                    min-height: 31px;
                }
                :host:focus{
                    outline: -webkit-focus-ring-color auto 1px;
                }
                #input {
                    border: 0;
                    outline: none;
                    display: inline-block;
                    min-width: 30px; 
                    max-width: 400px;
                    display:inline-block;
                }
                #tag-container>span {
                    display: inline-flex;
                    align-content: center;
                    justify-content: center;
                    min-width: 0;
                    padding-left: 4px;
                    padding-right: 4px;
                    border-style: solid;
                    border-width: 1px;
                    border-radius: 3px;
                    font-size: 12px;
                    line-height: 1.84615385;
                    text-decoration: none;
                    vertical-align: middle;
                    white-space: nowrap;
                    border-color: transparent;
                    background-color: #E1ECF4;
                    color: #2c5777;
                    margin: 2px;
                    font-size: 12px;
                    overflow: hidden;
                    vertical-align: middle;
                }
                .delete {
                    margin-top: 1px;
                    cursor: pointer;
                }
                .delete:hover{
                    opacity: .7;
                }
                .delete:active {
                    opacity: .9;
                }
            </style>
            <span id="tag-container">
            </span>
            <span id="input" contenteditable="true"></span>
        `;
        this.tagContainer = this.shadowRoot.getElementById('tag-container');
        this.inputElement = this.shadowRoot.getElementById('input');

        this.inputElement.addEventListener('keydown', (event) => {
            //add the new tag
            if (event.key === 'Enter') {
                this.addTag(this.inputElement.innerText.trim());
                this.inputElement.innerHTML = '';
                event.preventDefault();
                //if they click the back space at an empty text prompt, delete the last tag added
            } else if (event.key === 'Backspace' && !this.inputElement.innerText && this.tagContainer.children.length > 0) {
                this.tagContainer.removeChild(this.tagContainer.children[this.tagContainer.children.length - 1]);
            }
        });

        //focus the textbox anytime the user clicks the element
        this.addEventListener('click', (event) => {
            //only focus when clicking on the host element directly
            if (event.composedPath()[0] !== this) {
                return;
            }
            this.inputElement.focus();
            //move caret to the end
            if (window.getSelection && document.createRange) {
                var range = document.createRange();
                range.selectNodeContents(this.inputElement);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        });
    }
}

window.customElements.define('tagger-input', TaggerInputElement);