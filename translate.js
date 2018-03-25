require("dotenv").config();

const language = require("@google-cloud/language");
const client = new language.LanguageServiceClient();

module.exports = text => client
    .analyzeSentiment({
        document: {
            content: text,
            type: "PLAIN_TEXT"
        }
    })
    .then(results => results[0])
    .catch(err => {
        console.error("ERROR:", err);
    });