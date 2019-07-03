class TaggerInputElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
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
                .tag {
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
                }
            </style>
            <span id="tag-container">
                <span class="tag">Angular</span>
                <span class="tag">JSX</span>
            </span>
            <span id="input" contenteditable="true"></span>
        `;
        var inputElement = this.shadowRoot.getElementById('input');

        //focus the textbox anytime the user clicks the element
        this.addEventListener('click', (event) => {
            //only focus when clicking on the host element directly
            if (event.composedPath()[0] !== this) {
                return;
            }
            inputElement.focus();
            //move caret to the end
            if (window.getSelection && document.createRange) {
                var range = document.createRange();
                range.selectNodeContents(inputElement);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        });
    }
}

window.customElements.define('tagger-input', TaggerInputElement);