const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

try {
  // who-to-greet defined in input metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`hello ${nameToGreet}`);
  const time = (new Date()).toTimeString();
  core.setOutput('time', time);
  // get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`the event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}

try {
  const files = fs.readdirSync();
  console.log(`current directory: ${files}`);
  const upLevel = fs.readdirSync('../');
  console.log(`level up directory: ${upLevel}`);
  console.log('updating image...');
  const imageConfig = JSON.parse(fs.readFileSync('../test/data/image-config.json', { encoding: 'utf-8' }));
  const imageRegex = new RegExp(`^${imageConfig.registry}\/${imageConfig.image}:(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$`, 'g');
  const imageString = `${imageConfig.registry}/${imageConfig.image}:${imageConfig.tag}`;
  const compose = fs.readFileSync('../test/data/docker-compose.yml', { encoding: 'utf-8' });
  const updatedCompose = compose.replace(imageRegex, imageString);
  console.log(updatedCompose);
} catch (error) {
  core.setFailed(error.message);
}
