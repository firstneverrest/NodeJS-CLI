import fs from 'fs';

import figlet from 'figlet';
import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import boxen from 'boxen';
import { createSpinner } from 'nanospinner';

let userInput = {
  directoryName: '',
  gitignore: false,
  packageJson: false,
  readme: false,
};

const askUserInput = async () => {
  const { directoryName } = await inquirer.prompt({
    type: 'input',
    name: 'directoryName',
    message: 'What is your project name?',
  });

  const { gitignore } = await inquirer.prompt({
    type: 'confirm',
    name: 'gitignore',
    message: 'Do you want to add a .gitignore file?',
  });

  const { packageJson } = await inquirer.prompt({
    type: 'confirm',
    name: 'packageJson',
    message: 'Do you want to add a package.json file?',
  });

  const { readme } = await inquirer.prompt({
    type: 'confirm',
    name: 'readme',
    message: 'Do you want to add a README.md file?',
  });

  userInput.directoryName = directoryName;
  userInput.gitignore = gitignore;
  userInput.packageJson = packageJson;
  userInput.readme = readme;
};

const createDirectory = async () => {
  if (!fs.existsSync(userInput.directoryName)) {
    fs.mkdir(userInput.directoryName, (err) => {
      if (err) console.log(err);
    });
  } else {
    fs.rmdir(userInput.directoryName, (err) => {
      if (err) console.log(err);
    });
  }
};

const createGitIgnore = async () => {
  const gitignore = `node_modules`;
  fs.writeFile(`./${userInput.directoryName}/.gitignore`, gitignore, (err) => {
    if (err) console.log(err);
  });
};

const createPackageJson = async () => {
  const packageJson = `{
    "name": "${userInput.directoryName}",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "test": "echo \\"Error: no test specified\\" && exit 1",
        "start": "node index.js"
    },
    "keywords": [],
    "author": "",
    "license": "MIT"
}`;
  fs.writeFile(
    `./${userInput.directoryName}/package.json`,
    packageJson,
    (err) => {
      if (err) console.log(err);
    }
  );
};

const createReadme = async () => {
  const readme = `# ${userInput.directoryName}`;
  fs.writeFile(`./${userInput.directoryName}/README.md`, readme, (err) => {
    if (err) console.log(err);
  });
};

const createFiles = async () => {
  const spinner = createSpinner('Creating files...');
  spinner.start();

  await createDirectory();
  if (userInput.gitignore) await createGitIgnore();
  if (userInput.packageJson) await createPackageJson();
  if (userInput.readme) await createReadme();

  spinner.success({ text: 'Files were created!' });
};

const main = async () => {
  const title = 'NodeJS starter pack';
  figlet(title, (err, data) => {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log(gradient.pastel.multiline(data));
  });

  await new Promise((resolve) => setTimeout(resolve, 100));

  console.log(`
  Welcome to ${chalk.cyan(title)}!
  I could help you initialize nodejs project without creating by manual.
  Let's get started!
  `);

  await askUserInput();
  await createFiles();

  console.log(
    boxen(
      `
${chalk.green('Directory name:')} ${chalk.yellow(userInput.directoryName)}
${chalk.green('Gitignore:')} ${chalk.yellow(userInput.gitignore)}
${chalk.green('Package.json:')} ${chalk.yellow(userInput.packageJson)}
${chalk.green('README.md:')} ${chalk.yellow(userInput.readme)}
    `,
      { padding: 1 }
    )
  );
};

main();
