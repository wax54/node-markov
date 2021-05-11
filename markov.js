/** Textual markov chain generator */


class MarkovMachine {

  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter(c => c !== "");
    this.chains = this.makeChains();
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains() {
    let chains = {};
    for(let i = 0; i < this.words.length; i++){
      const currWord = this.words[i];
      //could add something here to check for punctuation 
      //if so, next word actually = undefined.
      const nextWord = this.words[i+1];
      if(!chains[currWord]) {
        chains[currWord] = [nextWord];
      }else{
        chains[currWord].push(nextWord);
      }
    }
    return chains;
  }


  /**
   * return random text from chains
   * 
   * @param { Number } numWords the number of words in the resulting text 
   * @returns { String } the REsulting text
   */
  makeText(numWords = 5) {
    
    let i = 0;
    let currWord = this.words[i];
    let text = [[currWord]];

    for(let j = 1; j < numWords; j++){
      const nextWordOptions = this.chains[currWord];

      let nextWord = randElement(nextWordOptions);
      if (!nextWord) {
        //end of the chain
        i++;
        if(!this.words[i]) i = 0;
        nextWord = this.words[i];
        text.push([]);
      }
      text[text.length - 1].push(nextWord);
      currWord = nextWord;
    }
    //constructing the sentence
    let sentenceArr = [];
    for(let sentence of text){
      let sentenceText = sentence.join(' ');
      sentenceText += '.';
      sentenceArr.push(sentenceText);
    }
    const result = sentenceArr.join(' ');
    return result;
  }

}

/**
 * 
 * @param { Array } arr a list of items
 * @returns a random item from the list (or false if the list is empty)
 */
function randElement(arr){
  const length = arr.length;
  if(length != 0){
      return arr[randBetween(0, length-1)];
  }
  else{
      return false
  }
}

/**
 * 
 * @param {Number} min The lowest number you might want back
 * @param {Number} max The highest number you might want back
 * @returns {Number} a random number (inclusivley) between min and max
 */
function randBetween(min=0,max=100){
  return Math.floor( (Math.random() * (max - min + 1) + min));
}

module.exports = {
  MarkovMachine,
  randElement,
  randBetween
}