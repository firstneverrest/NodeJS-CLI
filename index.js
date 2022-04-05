import figlet from 'figlet';
import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import boxen from 'boxen';
import { createSpinner } from 'nanospinner';
import { menu } from './menu.js';

let customerName,
  customerDessert,
  customerDrink,
  menuData = menu,
  price = 0;

const askName = async () => {
  const { name } = await inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'What is your name?',
  });
  customerName = name;
};

const askMenu = async () => {
  const { dessert } = await inquirer.prompt({
    type: 'list',
    name: 'dessert',
    message: 'What dessert would you like to order?',
    choices: menuData.desserts.map((dessert) => dessert.name),
  });

  const { drink } = await inquirer.prompt({
    type: 'list',
    name: 'drink',
    message: 'What would you like to drink?',
    choices: menuData.drinks.map((drink) => drink.name),
  });

  customerDessert = dessert;
  customerDrink = drink;
  console.log(`You ordered ${dessert} and ${drink}`);
};

const loading = async () => {
  const spinner = createSpinner('Cooking...');
  spinner.start();
  await new Promise((resolve) => setTimeout(resolve, 1500));
  spinner.success({ text: 'Your order is ready' });
};

const calculatePrice = () => {
  const dessert = menuData.desserts.find(
    (dessert) => dessert.name === customerDessert
  );
  const drink = menuData.drinks.find((drink) => drink.name === customerDrink);
  price = dessert.price + drink.price;
};

const printResult = () => {
  console.log(
    boxen(
      `
Name: ${customerName}
Your order: ${customerDessert} and ${customerDrink}
Price: $${price.toFixed(2)}
  `,
      {
        title: 'Neverrest Cafe Receipt',
        titleAlignment: 'center',
        padding: 1,
        margin: 1,
        borderStyle: 'single',
      }
    )
  );
};

const greet = async () => {
  const title = 'Neverrest Cafe';
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
  Lovely cafe to enjoy every meal with outdoor seating with a chilling atmosphere.
  Select your menu and enjoy your meal.
  `);

  await askName();
  await askMenu();
  await loading();
  calculatePrice();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await printResult();
};

greet();
