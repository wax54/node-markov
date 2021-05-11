const { MarkovMachine, randElement, randBetween } = require('./markov');
describe("Markov Machine Tests", ()=>{
    test("Machine has correct params", () => {
        const mm = new MarkovMachine("Hello Julian Richard");
        expect(mm.words).toEqual(['Hello', 'Julian', 'Richard']);
        expect(mm.chains).toEqual({ 
            Hello: ['Julian'],
            Julian: ['Richard'],
            Richard: [undefined]
        });
    });

    test("Machine filters out return characters", () => {
        const mm = new MarkovMachine("\r\n \r   \r\n hello");
        expect(mm.words).toEqual(['hello']);
        expect(mm.chains).toEqual({ hello: [undefined]});
    });

    test("makeChains function",()=>{
        const mm = new MarkovMachine("");
        expect(mm.words).toEqual([]);
        expect(mm.chains).toEqual({});
        mm.words = ['one', 'two', 'three'];
        expect(mm.makeChains()).toEqual({
            one: ['two'],
            two: ['three'],
            three: [undefined] 
        });
    });

    test("makeText function", () => {
        const generatedTextLength = 10;
        const testText = "Good Morning Banfield, I'm going to the park. Would you like to go to the park with me?"
        
        const mm = new MarkovMachine(testText);
        const generatedText = mm.makeText(generatedTextLength);
        const textArr = generatedText.split(/[ \r\n]+/);

        expect(textArr.length).toEqual(generatedTextLength);

        for(word of textArr){
            //kindof hacky way of removing period
            const testWord = word.split('.')[0];
            expect(mm.words).toContain(testWord);
        }
    });

    test("Machine puts periods if it reaches the end of the line", () => {
        const mm = new MarkovMachine("hello");
        const generatedText = mm.makeText(2);
        expect(generatedText).toEqual('hello. hello.');
    });
});

describe("randElement Tests", () => {
    test("returns element from array", () => {
        const testArr = ['one', 'two', 'three'];
        const testEl = randElement(testArr);
        expect(testArr).toContain(testEl);
    });
    test("returns false if array is empty", () => {
        const testArr = [];
        const testEl = randElement(testArr);
        expect(testEl).toBeFalsy();
    });
});

describe("randBetween Tests", () => {
    test("returns a number between the two numbers", () => {
        const min = 0;
        const max = 0;
        const testResult = randBetween(min, max);
        expect(testResult).toEqual(0);
    });
    test("Negative numbers work as expected", () => {
        const min = -100;
        const max = 0;
        const testResult = randBetween(min, max);
        expect(testResult).toBeGreaterThanOrEqual(-100);
        expect(testResult).toBeLessThanOrEqual(0);
    });
});





function readFromFile(filepath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(`${filepath}`, 'utf8', (err, text) => {
            if (err) {
                //const errorString = "Error finding data for " + filepath + "\n";
                reject(false);
            } else {
                resolve(text);
            }
        });
    });
}
