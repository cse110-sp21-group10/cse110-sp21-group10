class bulletElement extends HTMLElement {
    constructor() {
      super(); 
  
      const template = document.createElement('template');
  
      template.innerHTML = `
          <style>
            //   .post {
            //       max-width: 90vw;
            //       padding: 20px;
  
            //       align-self: center;
  
            //       display: grid;
            //       grid-template-areas: 
            //         "title img img"
            //         "content content content"
            //         "content content content"
            //         "audio audio audio";
            //       gap: 10px;
            //       grid-template-columns: repeat(2, 1fr);
            //   }
  
            //   .entry-image {
            //       grid-area: img
            //       height: 100%;
            //       align-self: center;
            //       justify-self: center;
            //       max-height: 350px;
            //       max-width: 500px;
            //       border-radius: 6px;
            //   }
  
            //   .post section {
            //     display: flex;
            //     padding: 30px;
            //     flex-direction: column;
            //     border-radius: 6px;
            //     background-color: white;
            //     list-style-type: none;
            //   }
  
            //   .entry-title-section {             
            //       grid-area: title;
            //   }
  
            //   .entry-content-section {
            //       grid-area: content;
            //   }
  
            //   .entry-audio-section {
            //     grid-area: audio;
            // }
  
  
            // </style>

          <div class="outer-bullet">
            <div class="inner-bullet">
              <button class="bullet-button"><i class="fas fa-circle"></i></button>
              <p class="bullet-entry" contenteditable="true"></p>
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

  //Scratch code

  // .bullet-button {
  //   font-size:10px;
  //   padding: 0;
  //   border: none;
  //   background: none;
  // }

  // <button class="bullet-button"><i class="fas fa-circle"></i></button>