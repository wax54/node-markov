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
      const nextWord = this.words[i+1];
      if(!chains[currWord]) {
        chains[currWord] = [nextWord];
      }else{
        chains[currWord].push(nextWord);
      }
    }
    return chains;
  }


  /** return random text from chains */

  makeText(numWords = 5) {
    let i = 0;
    let currWord = this.words[i];
    let text = currWord + ' ';
    for(let j = 0; j < numWords; j++){
      const nextWordOptions = this.chains[currWord];

      let nextWord = randElement(nextWordOptions);
      if (!nextWord) {
        //end of the chain
        i++;
        nextWord = this.words[i];
        text += '. ';
      }
      text += nextWord + ' ';
      currWord = nextWord;
    }
    return text;
  }

}


function randElement(arr){
  const length = arr.length;
  if(length != 0){
      return arr[randBetween(0, length-1)];
  }
  else{
      return false
  }
}

function randBetween(min=0,max=100){
  return Math.floor( (Math.random() * (max - min + 1) + min));
}

module.exports = {
  MarkovMachine
}