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
            <span class="inner-bullet">
              <button class="bullet-button"><i class="fas fa-circle"></i></button>
              <p class="bullet-entry" contenteditable="true"></p>
            </span>
          </div>
          `;
  
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
  
    get entry() {




    //   let entryObj = {
    //     'title': this.shadowRoot.querySelector('.entry-title').innerText,
    //     'date': this.shadowRoot.querySelector('.entry-date').innerText,
    //     'content': this.shadowRoot.querySelector('.entry-content').innerText,
    //   };
  
    //   if (this.shadowRoot.querySelector('.entry-image')) {
    //     let imageObj = {
    //       'src': this.shadowRoot.querySelector('.entry-image').getAttribute('src'),
    //       'alt': this.shadowRoot.querySelector('.entry-image').getAttribute('alt')
    //     }
    //     entryObj.image = imageObj;
    //   }
  
    //   if (this.shadowRoot.querySelector('.entry-audio')) {
    //     entryObj.audio = this.shadowRoot.querySelector('.entry-audio').getAttribute('src');
    //   }
  
    //   return entryObj;
    }
  
    set entry(entry) {




    //   this.shadowRoot.querySelector('.entry-title').innerText = entry.title;
    //   this.shadowRoot.querySelector('.entry-date').innerText = entry.date;
    //   this.shadowRoot.querySelector('.entry-content').innerText = entry.content;
    //   if (entry.image) {
    //     let entryImage = document.createElement('img');
    //     entryImage.classList.add('entry-image');
    //     entryImage.src = entry.image.src;
    //     entryImage.alt = entry.image.alt;
    //     this.shadowRoot.querySelector('.post').appendChild(entryImage);
    //   }
    //   if (entry.audio) {
    //     let entryAudio = document.createElement('audio');
    //     entryAudio.classList.add('entry-audio');
    //     entryAudio.src = entry.audio;
    //     entryAudio.controls = true;
    //     this.shadowRoot.querySelector('.entry-audio-section').appendChild(entryAudio);
    //   }
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