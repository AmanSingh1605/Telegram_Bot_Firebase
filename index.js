//made by Aman Singh. This telegram bot template used to connect firebase RTDB and telegram deploy
//and deploy it on firebase Functions so that telegram can run after.
//To initate the project u need to run some commands to initate the project
//Read Readme.txt file

var admin = require("firebase-admin"); //firebase admin import
const functions = require("firebase-functions"); //firebase functions to export
const { Telegraf } = require("telegraf"); //telegraf library
const bot = new Telegraf("BOT_TOKEN_API"); //Telegram bot token from bot-father

//initalize firebase admin SDK
var serviceAccount = require("./serviceAccountkey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "firebase_project_url",
});

//using cloud functions connect to database
const db = admin.database();
const ref = db.ref("board1/outputs/digital"); //path to variables in database

// start command
bot.start((ctx) =>
  ctx.reply(
    "Welcome \n \n Use the following command to get current readings.\n /readings\n\nUse the following command to get current states.\n /states\n\n Use the following command to turn Outputs ON.\n /Output1_ON\n /Output2_ON \n /Output3_ON \n /Output4_ON \n\n Use the following command to turn Outputs OFF.\n /Output1_OFF \n  /Output2_OFF \n  /Output3_OFF \n/Output4_OFF\n\n Use the following command for emergency shutdown! \n/AZ5"
  )
);
// Define the commands to update Firebase boolean values

bot.command("readings", async (ctx) => {
  const snapshot1 = await admin
    .database()
    .ref("board1/outputs/User/level")
    .once("value");
  const level = snapshot1.val();
  const snapshot2 = await admin
    .database()
    .ref("board1/outputs/User/oxygen")
    .once("value");
  const oxygen = snapshot2.val();
  const snapshot3 = await admin
    .database()
    .ref("board1/outputs/User/temperature")
    .once("value");
  const temperature = snapshot3.val();
  const snapshot4 = await admin
    .database()
    .ref("board1/outputs/User/turbidity")
    .once("value");
  const turbidity = snapshot4.val();
  // ctx.reply(level);
  ctx.reply(
    `Readings(Sensors):\n\n 🌧Water Level: ${level} \n\n  Oxygen Level: ${oxygen} \n\n 🌡Temperature: ${temperature}\n\n 🌪Turbuidity: ${turbidity}`
  );
});
// function states
bot.command("states", async (ctx) => {
  const switch1 = await admin
    .database()
    .ref("board1/outputs/digital/25")
    .once("value");
  const switch2 = await admin
    .database()
    .ref("board1/outputs/digital/26")
    .once("value");
  const switch3 = await admin
    .database()
    .ref("board1/outputs/digital/27")
    .once("value");
  const switch4 = await admin
    .database()
    .ref("board1/outputs/digital/33")
    .once("value");
  ctx.reply(
    `Switches states: \n\nOutput 1: ${switch1.val()}\nOutput 2: ${switch2.val()}\nOutput 3: ${switch3.val()}\nOutput 4: ${switch4.val()}\n`
  );
});

// GPIO control commands
bot.command("Output1_ON", (ctx) => {
  ref.update({ 25: 1 });
  ctx.reply("Output 1 set to ON");
});

bot.command("Output1_OFF", (ctx) => {
  ref.update({ 25: 0 });
  ctx.reply("Output 1 set to OFF");
});
bot.command("Output2_ON", (ctx) => {
  ref.update({ 26: 1 });
  ctx.reply("Output 2 set to ON");
});

bot.command("Output2_OFF", (ctx) => {
  ref.update({ 26: 0 });
  ctx.reply("Output 2 set to OFF");
});
bot.command("Output3_ON", (ctx) => {
  ref.update({ 27: 1 });
  ctx.reply("Output 3 set to ON");
});

bot.command("Output3_OFF", (ctx) => {
  ref.update({ 27: 0 });
  ctx.reply("Output 3 set to OFF");
});
bot.command("Output4_ON", (ctx) => {
  ref.update({ 33: 1 });
  ctx.reply("Output 4 set to ON");
});

bot.command("Output4_OFF", (ctx) => {
  ref.update({ 33: 0 });
  ctx.reply("Output 4 set to OFF");
});

//launching bot
bot.launch();

//it needed to deploy functions on cloud 
exports.telegramBot = functions.https.onRequest((req, res) => {
  if (req.method === "POST") {
    let update = req.body;
    bot.handleUpdate(update);
    res.send("OK");
  } else {
    res.send("Invalid request method");
  }
});
