import readline from "node:readline/promises";
import fetch, { Headers } from "node-fetch";
import { cyan, red, yellow, bold } from "colorette";
import { config } from "dotenv";

config();

const headers = new Headers();
headers.append("apikey", process.env.API_KEY);

const convert = async (from, to, amount) => new Promise(resolve => {
    fetch(`https://api.apilayer.com/exchangerates_data/convert?from=${from}&to=${to}&amount=${amount}`, {
        method: "GET",
        redirect: "follow",
        headers
    }).then(res => res.json()).then(resolve);
});

const showInput = async () => {
    console.log("");
    try {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const from = await rl.question(`${cyan("Convert")}: Enter the currency you want to convert from: `);
        const to = await rl.question(`${cyan("Convert")}: Enter the currency you want to convert to: `);
        const amount = await rl.question(`${cyan("Convert")}: Enter the amount you want to convert: `);

        rl.close();

        const { success, query, result } = await convert(from, to, amount);
        if(!success) return console.error(`${cyan("Convert")}: ${red("Check your API key or the currency you entered.")}`);
        console.log(`${cyan("Convert")}: ${yellow(query.amount)} ${bold(query.from)} is equal to ${yellow(result)} ${bold(query.to)}`);
    }
    catch {
        console.error(`${cyan("Convert")}: ${red("Unexpected error.")}`);
    }

    showInput();
};

showInput();