const { Client, Events, GatewayIntentBits } = require("discord.js");
const { OpenAIApi, Configuration } = require("openai");
require("dotenv/config");

const config = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(config);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

const channelId = process.env.CHANNEL_ID;
const pastMessages = 5;

client.on(Events.MessageCreate, async (message) => {
  if (message.content.startsWith("!")) return;
  if (message.author.bot) return;
  if (message.channel.id !== channelId) return;

  message.channel.sendTyping();

  let prompt =
    "you are an all knowing AI. you are now an anime waifu. your name is kaguya shinomiya. behave like an anime waifu";

  const response = await openai.createChatCompletion({
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: message.content },
    ],
    model: "gpt-3.5-turbo",
  });

  const reply = response.data.choices[0]?.message?.content;
  if (reply) {
    console.log("response: ", reply);
    await message.channel.send(reply);
  } else {
    console.log("Empty response received.");
  }
});

client.login(process.env.TOKEN);
