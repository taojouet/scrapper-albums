/* Elements :

 - title : c-gallery-vertical-album__title
 - number : c-gallery-vertical-album__number
 - description : c-gallery-vertical-album__description
 - subtitle : c-gallery-vertical-album__subtitle
 
    { 
        title: title, 
        number: number, 
        description: description, 
        subtitle: subtitle 
    }
*/
const { Builder, By } = require('selenium-webdriver');
const { exec } = require("child_process");

const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const app = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv/config');

const imgModel = require('./model.js');

async function scrapper() {
    let result = [];
    let driver = await new Builder().forBrowser('firefox').build();




    // mongoose.connect(process.env.MONGO_URL,
    //     { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    //         console.log('connected')
    //     });

    // const schema = new mongoose.Schema({
    //     name: String
    // }, {
    //     capped: { size: 1024 },
    //     bufferCommands: false,
    //     autoCreate: false // disable `autoCreate` since `bufferCommands` is false
    // });

    // const Model = mongoose.model('Test', schema);
    // // Explicitly create the collection before using it
    // // so the collection is capped.
    // await Model.createCollection();

    try {
        // Navigate to Url
        await driver.get('https://www.rollingstone.com/music/music-lists/best-albums-of-all-time-1062063/');

        let id = await driver.findElements(By.className('c-gallery-vertical-album__number'));
        const nbOfElements = id.length;
        let title = await driver.findElements(By.className('c-gallery-vertical-album__title'));
        let subtitle = await driver.findElements(By.className('c-gallery-vertical-album__subtitle'));
        let description = await driver.findElements(By.className('c-gallery-vertical-album__description'));
        let image = await driver.findElements(By.className('c-gallery-vertical-album__image u-gallery-react-placeholder-shimmer'));
        // let image = await driver.findElements(By.className('c-gallery-vertical-album__image'));

        // curl https://www.rollingstone.com/wp-content/uploads/2020/09/R1344-500-Arcade-Fire-Funeral.jpg?w=800 -o ./Images/test.png
        // console.log(id);
        // for (let i of id) {
        // result.push({ id: await i.getText() });
        for (let n = 0; n < nbOfElements; n++) {
            let i = await id[n].getText();
            let t = await title[n].getText();
            let s = await subtitle[n].getText();
            let d = await description[n].getText();

            let tURL = t.replace(/'/g, "").replace(/’/g, "").replace(/,/g, "").replace(/!/g, "").replace("+", "").replace(/é/g, "").replace(/ /g, "-");
            tURL = tURL.replace("--", "x").replace("/", "-");
            let url = "https://www.rollingstone.com/wp-content/uploads/2020/09/R1344-" + i + "-" + tURL + ".jpg"
            // console.log(url);
            result.push({
                id: i,
                title: t,
                subtitle: s,
                url: url,
                // description: d,
            });
            try {
                exec("curl " + url + " -o ./Images/" + i + ".jpg");
            } catch (error) {
                console.log(error);
            }
        }
        for (let t of title) {
            // result.push({ title: await t.getText() });

            // console.log(await im.getAttribute("src"));
            // app.post('/', upload.single('image'), (req, res, next) => {

            // let obj = {
            //     id: id,
            //     title: title,
            //     subtitle: subtitle,
            //     description: description,
            //     // img: {
            //     //     data: fs.readFileSync(path.join(image)),
            //     //     contentType: 'image/png'
            //     // }
            // }

            // imgModel.create(obj, (err, item) => {
            //     if (err) {
            //         console.log(err);
            //     }
            //     else {
            //         // item.save();
            //         res.redirect('/');
            //     }
            // });
            // });
        }

    }
    finally {
        await driver.quit();
    }
    // console.log(result);
    return;
}
module.exports = scrapper();