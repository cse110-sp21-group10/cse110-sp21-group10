class bulletElement extends HTMLElement {
  constructor () {
    super();

    const template = document.createElement('template');

    template.innerHTML = `
          <style>
            .bullet-button {
              font-size:10px;
              border: none;
              background: none;
              float: left;
              padding-top: .9%;
            }
            
            .bullet-button:hover {
              font-size: 12px;
              position: relative;
              padding-top: .8%;
              right: 1px;
              width: 22px;
            }
            
            .bullet-entry {
              display: inline-block;
              width: 65vw;
              font-size: larger;
              margin: 0;
              /* border: 5px solid black; */
            
              padding-left: 1%;
              padding-top: .5%;
              padding-bottom: .5%;
            }
            
            .entry {
              margin-left: 1%;
              margin-right: 12%;
            
              padding-left: .5%;
              padding-right: 1%;
            }
            
            .entry:hover {
              background-color: rgb(241, 241, 241);
              border-radius: 20px;  
            }
            
            .entry:hover .bullet-delete {
              display: inline-block;
            }
            
            .bullet-delete {
              display: none;
              float: right;
              padding-top: .9%;
            
              border: none;
              background-color: transparent;
            }
            
            .bullet-delete:hover {
              font-size: 15px;
              position: relative;
              padding-top: .8%;
              left: .75px;
            }
            
            [contenteditable] {
              outline: 0px solid transparent;
            }
          </style>
          
          <div class="button">         
            <button class="bullet-button"><i class="fas fa-circle"></i></button>
            <p class="bullet-entry" contenteditable="true">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure 
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non 
              proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <button class="bullet-delete"><i class="fas fa-times"></i></button>
          </div>
          `;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  get entry () {

  }

  set entry (entry) {

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
