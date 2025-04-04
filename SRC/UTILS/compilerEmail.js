const handlebars = require("handlebars")
const fs = require("fs/promises")

const compilerEmailHtml = async (file, context) => {

    const html = await fs.readFile(file)
    const compilerEmail = handlebars.compile(html.toString())
    const htmlString = compilerEmail(context)
    return htmlString

};

module.exports =  compilerEmailHtml