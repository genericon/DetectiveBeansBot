import * as fs from 'fs';
import { Client, Message } from 'discord.js';
import { createConnection } from 'typeorm';
import { GameService, MessageHandler } from './services';
import { config } from './config';

(async () => {

  await createConnection();

  const storyData = fs.readFileSync(config.story);
  const gameService = new GameService(storyData);

  const client = new Client();

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on('message', async (message: Message) => {
    await MessageHandler.onMessage(message, gameService);
  });

  client.login(config.token);

})();