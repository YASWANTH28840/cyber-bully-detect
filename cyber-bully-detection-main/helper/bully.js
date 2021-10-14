const checkText = async (text) => {
    try {
        console.log("Text to be checked : ", text);
        const { spawn } = require("child_process");
        const child = spawn("python", ["././ML/textAnalyzer.py", text]);
        let data = "";
        for await (const chunk of child.stdout) data += chunk;
        data = parseFloat(data);
        console.log("Score : ", data);
        return data;
    } catch (e) {
        throw new Error(e.message);
    }
};

const checkImage = async (data) => {
    try {
        console.log(data);
        return false;
        // console.log("Text to be checked : ", text);
        // const { spawn } = require("child_process");
        // const child = spawn("python", ["././ML/textAnalyzer.py", text]);
        // let data = "";
        // for await (const chunk of child.stdout) data += chunk;
        // data = parseFloat(data);
        // console.log("Score : ", data);
        // return data;
    } catch (e) {
        throw new Error(e.message);
    }
};

// checkText("fuck");
module.exports = { checkText, checkImage };
