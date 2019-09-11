class PlumbTaggerElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        //create the DOM structure
        this.shadowRoot.innerHTML = `
            <span id="tags-container"></span>
            <span id="input" contenteditable="true"></span>
            <style>${PlumbTaggerElement.styles}</style>
            <template id="tag-template">
                <span class="tag">
                    <span class="tag-name"></span>
                    <span class="delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg>
                    </span>
                </span>
            </template>
        `;

        //listen for input keydown events
        this.inputElement.addEventListener('keydown', this.inputKeydown.bind(this));

        //focus the textbox anytime the user clicks the element
        this.addEventListener('click', this.hostClick.bind(this));
    }

    connectedCallback() {
        this._value = this.getValueFromAttribute() || [];

        this.renderTags();
        this.syncAttributes();
    }

    renderTags() {
        this.tagContainer.innerHTML = '';
        this._value.forEach((tagName, index) => {

            var tagElement = this.tagTemplate.content.firstElementChild.cloneNode(true) as HTMLSpanElement;
            tagElement.getElementsByClassName('tag-name')[0].innerHTML = tagName;
            tagElement.getElementsByClassName('delete')[0].addEventListener('click', () => {
                this._value.splice(index, 1);
                this.renderTags();
                this.syncAttributes();
            });
            this.tagContainer.appendChild(tagElement);
        });
    }

    /**
     * The html element where all tags get added
     */
    private get tagContainer(): HTMLSpanElement {
        return this.shadowRoot.getElementById('tags-container');
    }

    /**
     * The editable element where users will be typing
     */
    private get inputElement(): HTMLSpanElement {
        return this.shadowRoot.getElementById('input');
    }

    private get tagTemplate(): HTMLTemplateElement {
        return this.shadowRoot.getElementById('tag-template') as any;
    }

    private static styles = `INJECT_STYLES_HERE`;

    get value() {
        return this._value;
    }
    set value(value) {
        this._value = Array.isArray(value) ? value : [];
        //draw all the tags
        this.renderTags();
        //update the attribute with this value
        this.syncAttributes();
    }
    private _value: string[];

    public static get observedAttributes() {
        return ['value'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.tagContainer && oldValue !== newValue) {
            if (name === 'value') {
                let value = this.getValueFromAttribute();
                if (Array.isArray(value)) {
                    this._value = value;
                    this.renderTags();
                    this.syncAttributes();
                }
            }
        }
    }

    /**
     * Synchronizes the attributes with the state
     */
    private syncAttributes() {
        //value attribute
        let currentValue = this.getAttribute('value');
        let newValue = JSON.stringify(this._value)
        if (currentValue !== newValue) {
            this.setAttribute('value', newValue);
        }

        //empty attribute
        if (this._value.length === 0) {
            this.setAttribute('empty', '');
        } else {
            this.removeAttribute('empty');
        }
    }

    private getValueFromAttribute() {
        const attr = this.getAttribute('value');
        const attrValue = eval(`(function(){return ${attr};})()`);
        if (Array.isArray(attrValue)) {
            return attrValue;
        } else {
            return undefined;
        }
    }

    /**
     * Fires any time the input element has a keydown press
     * @param event 
     */
    private inputKeydown(event) {
        //add the new tag
        if (event.key === 'Enter') {
            //get the tag from the input element
            let tag = this.inputElement.innerText.trim();
            if (tag.length > 0) {
                //clear the input element
                this.inputElement.innerText = '';

                //save the tag
                this._value.push(tag);

                this.renderTags();
                this.syncAttributes();

                this.dispatchEvent(new CustomEvent('change', {
                    bubbles: false,
                    detail: this._value
                }));
            }
            event.preventDefault();
            //if they click the back space at an empty text prompt, delete the last tag added
        } else if (event.key === 'Backspace' && !this.inputElement.innerText && this.tagContainer.children.length > 0) {
            this._value.pop();
            this.renderTags();
            this.syncAttributes();
        }
    }

    /**
     * Called any time the host element is clicked
     * @param event
     */
    private hostClick(event) {
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
    }
}

window.customElements.define('plumb-tagger', PlumbTaggerElement);