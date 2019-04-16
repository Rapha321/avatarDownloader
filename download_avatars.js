let myArgv = process.argv[2]

var request = require('request');
var secrets = require('./secrets')
var fs = require('fs');

console.log('Welcome to the Github Avatar Downloader!');


function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + secrets.GITHUB_TOKEN
    }
  };
  request(options, function(err, res, body) {
    cb(err, JSON.parse(body));
  });
}


function downloadImageByURL(url, filePath) {
  request.get(url)
  .on('error', function (err) {
    throw err;
  })
  .pipe(fs.createWriteStream(filePath));
}

if (!myArgv) {
  throw "Error: Argument must be entered"
}
console.log("Downloading images...")
getRepoContributors(myArgv, myArgv, function(err, result) {
  if (err) throw err;

  for (let i = 0; i < result.length; i++) {
    // console.log(result[i].avatar_url)
    downloadImageByURL(result[i].avatar_url, `./${result[i].login}.jpg`)
  }
  console.log("Downloading image complete!")
});

