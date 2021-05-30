class bulletElement extends HTMLElement {
    constructor() {
      super(); 
  
      const template = document.createElement('template');
  
      template.innerHTML = `
          <style>
            .bullet-button {
              font-size:10px;
              border: none;
              background: none;
              float: left;
              padding-top: 7px;
            }
            
            .bullet-button:hover {
              font-size: 12px;
              position: relative;
              right: 1px;
              bottom: 1px;
              width: 22px;
            }
            
            .bullet-entry {
              display: inline-block;
              width: 80%;
              font-size: larger;
              margin: 0;
              padding-left: 0.5em;
            }
            
            [contenteditable] {
              outline: 0px solid transparent;
            }
          
            <div class="layer-1">
              <div class="layer-2">
                <button class="bullet-button"><i class="fas fa-circle"></i></button>
                <p class="bullet-entry" contenteditable="true">holdonmmmmmm </p>
              </div>
            </div>
          `;
  
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
  
    get entry() {

    }
  
    set entry(entry) {

    }
  
  }
  
  customElements.define('bullet-element', bulletElement);
  
   /**
   * JSON Format:
   *
   * {
   *    "B 210515 01 03": {
   *        "labelIDs": [
   *            "L##",
   *            "L##"
   *        ],
   *        "text": "foo",
   *        "value": (-1,0,1),
   *        "bulletIDs": [
   *            "B ###### ## ##",
   *            "B ###### ## ##"
   *        ] 
   *    }
   * }
   */