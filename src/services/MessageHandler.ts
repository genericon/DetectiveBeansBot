import { Message } from 'discord.js';
import { Story } from 'inkjs';
import { FuzzySearch } from 'fuzzy-search';
import { MessageFormatter } from './MessageFormatter';
import { GameService } from './GameService';


export class MessageHandler {
  static async onMessage(message: Message, gameService: GameService) {
      if (message.author.bot || message.channel.type !== 'dm') return;

      if (message.content === '!help') {
        let payload = `> **Commands**
                      > \`!start\` - begin a playthrough of *The Intercept*.
                      > \`!restart\` - restart your playthrough of *The Intercept*.
                      > \`!forget\` - delete your current playthough.
                      > \`!sitrep\` - see the last message and your current options.
                      > \`!select\` - select a choice using either a number or text.
                      > Progress is saved automatically when each choice is made.`
        message.channel.send(payload);
        return;
      }

      let gameState = await gameService.checkSave(message.author.id);
      let game: Story;
      if (!gameState) {
        if (message.content !== '!start') {
          let payload = `> Hello, ${message.author.username}.
                        > To start a game of **The Intercept** reply \`!start\`.
                        > To see all commands reply \`!help\``
          message.channel.send(payload);
          return;
        } else {
          game = await gameService.createGame(message.author.id);
          game.ContinueMaximally();
        }
      } else {
        game = await gameService.loadGame(message.author.id);
        game.ContinueMaximally();
      }

      let text = [];

      if (message.content === '!forget') {
        gameService.destroyGame(message.author.id);
        message.channel.send('> Game progress forgotten. Reply `!start` to begin a new game.');
        return;
      } else if (message.content === '!sitrep' || message.content === '!start') {
        game.ContinueMaximally();
        text.push(...gameService.getCurrentText(game));
        text.push(...gameService.sendChoices(message, game));
        message.channel.send(text.join('\n'));
        return;
      } else if (message.content === '!restart') {
        gameService.destroyGame(message.author.id);
        message.channel.send('> Game progress forgotten. Restarting game.');
        game = await gameService.createGame(message.author.id);
        game.ContinueMaximally();
        text.push(...gameService.getCurrentText(game));
        text.push(...gameService.sendChoices(message, game));
        message.channel.send(text.join('\n'));
        return;
      }

      while (game.canContinue) {
        let payload = await MessageFormatter.message(game.Continue().trim());
        if (payload.length > 2) text.push(payload);
      }

      if (game.currentChoices.length > 0) {
        let result = [];
        const messageInt = Math.floor(parseInt(message.content));
        if (!isNaN(messageInt) && game.currentChoices[messageInt - 1]) {
          result.push(game.currentChoices[messageInt - 1]);
        } else {
          const searcher = new FuzzySearch(game.currentChoices, ['text'], {
            caseSensitive: false,
          });
          result = await searcher.search(message.content);  
        }

        if (result.length > 0 && result[0].text.length > 0) {
          game.ChooseChoiceIndex(result[0].index);
          while (game.canContinue) {
            const payload = await MessageFormatter.message(game.Continue().trim());
            if (payload.length > 2) text.push(payload);
          }
        } else {
          text.push(MessageFormatter.message('**Pardon?**'));
          text.push(...gameService.getCurrentText(game));
        }
      }

      text.push(...gameService.sendChoices(message, game));
      message.channel.send(text.join('\n'));

      gameService.saveGame(message.author.id, game);
  }
};
