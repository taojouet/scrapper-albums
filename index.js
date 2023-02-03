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
const mongoose = require('mongoose');

const app = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv/config');

const imgModel = require('./model.js');



async function scrapper() {
    let result = [];

    const urls = [
        "https://www.rollingstone.com/music/music-lists/best-albums-of-all-time-1062063/",
        "https://www.rollingstone.com/music/music-lists/best-albums-of-all-time-1062063/linda-mccartney-and-paul-ram-1062783",
        "https://www.rollingstone.com/music/music-lists/best-albums-of-all-time-1062063/the-go-gos-beauty-and-the-beat-1062833",
        "https://www.rollingstone.com/music/music-lists/best-albums-of-all-time-1062063/stevie-wonder-music-of-my-mind-2-1062883",
        "https://www.rollingstone.com/music/music-lists/best-albums-of-all-time-1062063/shania-twain-come-on-over-1062933",
        "https://www.rollingstone.com/music/music-lists/best-albums-of-all-time-1062063/buzzcocks-singles-going-steady-2-1062983",
        "https://www.rollingstone.com/music/music-lists/best-albums-of-all-time-1062063/sade-diamond-life-1063033",
        "https://www.rollingstone.com/music/music-lists/best-albums-of-all-time-1062063/bruce-springsteen-nebraska-3-1063083",
        "https://www.rollingstone.com/music/music-lists/best-albums-of-all-time-1062063/the-band-music-from-big-pink-2-1063133",
        "https://www.rollingstone.com/music/music-lists/best-albums-of-all-time-1062063/jay-z-the-blueprint-3-1063183"
    ];


    mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
        try {
            console.log('connected')
        } catch (err) {
            console.log(err)
        }
    });

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
    for (let urlNb = 0; urlNb < urls.length; urlNb++) {

        let driver = await new Builder().forBrowser('firefox').build();

        try {
            // Navigate to Url
            // console.log(urlNb)
            await driver.get(urls[urlNb]);

            let id = await driver.findElements(By.className('c-gallery-vertical-album__number'));
            const nbOfElements = id.length;
            let title = await driver.findElements(By.className('c-gallery-vertical-album__title'));
            let subtitle = await driver.findElements(By.className('c-gallery-vertical-album__subtitle'));
            let description = await driver.findElements(By.className('c-gallery-vertical-album__description'));
            
            for (let n = 0; n < nbOfElements; n++) {
                let i = await id[n].getText();
                let t = await title[n].getText();
                let s = await subtitle[n].getText();
                let d = await description[n].getText();
                let date = s.split(" ")[1];
                // /'!éè-’i\+\b/g
                let tURL = t.replace(/['‘’,!é&#]/g, "").replace("+", "").replace(/ /g, "-").replace("--", "x").replace("/", "-");
                tURL = tURL;
                // console.log(t);
                let url = "https://www.rollingstone.com/wp-content/uploads/2020/09/R1344-0" + i + "-" + tURL + ".jpg"
                // console.log(url);

                result.push({
                    id: i,
                    title: t,
                    subtitle: s,
                    description: d,
                    date: date,
                    url: url,
                });


                /*
                ////////////// Scrapping images done, saved in 'Images' folder/////////////////////
                try {
                    exec("curl " + url + " -o ./Images/" + urlNb + "/" + i + ".jpg");
                    // console.log(url);

                } catch (err) {
                    console.log(err);
                }
                */
            }
            // for (let t of title) {
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
            // }

        }
        finally {
            driver.quit();
        }
        // console.log(result);
        // });
    }
    return;
}
module.exports = scrapper();