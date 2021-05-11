/** Command-line tool to generate Markov text. */

const fs = require('fs');
const axios = require('axios');
const {MarkovMachine} = require('./markov');

const OUTPUT_FILE_FLAG = 'o';
const INPUT_TYPE_FLAG = 'i';
const URL_INPUT_OPTION = 'url';
const FILE_INPUT_OPTION = 'file';

const INPUT_TYPE_OPTIONS = [FILE_INPUT_OPTION, 
                            URL_INPUT_OPTION];
const MARKOV_LENGTH = 100;

//defaults for the flags
const flags = {
    [OUTPUT_FILE_FLAG] : false,
    [INPUT_TYPE_FLAG]: FILE_INPUT_OPTION,
};

start(process.argv);


function handleInput(args) {
    const inputFiles = [];
    //throw out the first two args(they are node and the file I am running)
    for (let i = 2; i < args.length; i++) {

        if (args[i].startsWith('-')) {
            const flag = args[i].split('-')[1];
            if (flag == OUTPUT_FILE_FLAG) {
                //get to the next arg
                i++;
                //save the file path as the value for the flag
                flags[OUTPUT_FILE_FLAG] = args[i];
            } else if (flag == INPUT_TYPE_FLAG) {
                //get to the next arg
                i++;
                const inputType = args[i]
                //check if it's a valid option
                if(INPUT_TYPE_OPTIONS.includes(inputType)){
                    //save the type as the value for the flag
                    flags[INPUT_TYPE_FLAG] = inputType;
                }else{
                    console.error('INPUT TYPE NOT RECOGNIZED MAKE SURE IT MATCHES ONE OF THE FOLLOWING', INPUT_TYPE_OPTIONS);
                    process.exit(1);
                }
            }
        }
        //if it's not a flag, it's probably an input
        else {
            inputFiles.push(args[i]);
        }
    }
    return inputFiles;
}



async function start(args) {
    //get the inputs and sets the flags
    const inputs = handleInput(args);

    const promises = [];

    for (let input of inputs) {
        promises.push(getDataPromiseFor(input));
    }
    try {
        
        const dataArr = await Promise.all(promises);

        const inputText = dataArr.reduce((text, nextText) => text + nextText);
        const mm = new MarkovMachine(inputText);
        const resultText = mm.makeText(MARKOV_LENGTH);

        if (flags[OUTPUT_FILE_FLAG]) {
            //append the result to the output file
            writeToFile(flags[OUTPUT_FILE_FLAG], resultText);
            
        } else {
            console.log(resultText);
        }
    // process.exit(0);
    }catch (e) {
        console.log('make sure you use -i to specify input type("file", or "url")');
        console.error(e);
        process.exit(1);
    }
}

async function getDataPromiseFor(path) {
    let dataPromise;

    if (flags[INPUT_TYPE_FLAG] == URL_INPUT_OPTION) dataPromise = webCat(path);
    else if (flags[INPUT_TYPE_FLAG] == FILE_INPUT_OPTION) dataPromise = cat(path);

    return dataPromise;
}


function cat(filepath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(`${filepath}`, 'utf8', (err, text) => {
            if (err) {

                const errorString = `Error finding data for "${filepath}"\n`;
                reject(errorString);
            } else {
                resolve(text);
            }
        });
    });
}

async function webCat(url) {
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (err) {
        let error = `Error Fetching "${err.config.url}"\n`;
        if (err.response)
            error += `Request failed with status code ${err.response.status}`;
        throw error;
    }
}



function writeToFile(filepath, data) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(`${filepath}`, "\n" + data, { encoding: 'utf8', flag: 'a' }, (err) => {
            if (err) {
                reject("ERROR WRITING TO FILE" + filepath);
            }
            resolve();
        });
    });
}



/**
 * 
 * @param { String } string the string to be tested
 * @returns { boolean } whether or not the string was a URL with a HTTP or HTTPS protocol
 */
function isValidUrl(string) {
    try {
        let url = new URL(string);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch (e) {
        return false;
    }
}



module.exports = {
    OUTPUT_FILE_FLAG,
    flags,
    start,
    handleInput,
    getDataPromiseFor,
    cat,
    webCat,
    writeToFile,
    isValidUrl
};