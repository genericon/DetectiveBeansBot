import * as fs from 'fs';
import { Client, Message } from 'discord.js';
import { createConnection } from 'typeorm';
import { GameService, MessageHandler } from './services';
import { config } from './config';

(async () => {

  await createConnection();

  GameService.loadGameFile();

  const client = new Client();

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on('message', async (message: Message) => {
    await MessageHandler.onMessage(message);
  });

  client.login(config.token);

})();