#! /usr/bin/env node
var fs = require('fs');
var gm = require('gm');
var request = require('request');
var pictureTube = require('picture-tube');
var Bing = require('node-bing-api')({ accKey: 'jkT/W9ta85VZluFsVj75HaERVUogucszXhV/4J6CIls' });
var tube = pictureTube({ cols: 100 });

tube.pipe(process.stdout);

Bing.images(process.argv[2], {skip: 50, adult: 'Off'}, function(error, res, body){
  var res = body.d.results[Math.floor(Math.random() * body.d.results.length)];
  var fileName = new Date().getTime() + '';
  request
    .get(res.Thumbnail.MediaUrl)
    .pipe(fs.createWriteStream(fileName))
    .on('finish', function() {
      gm(fileName).write(fileName + '.png', function (err) {
        if (err) throw err;
        fs
          .createReadStream(fileName + '.png')
          .pipe(tube)
          .on('end', function() {
            fs.unlinkSync(fileName);
            fs.unlinkSync(fileName + '.png');
          });
      });
    });
});
