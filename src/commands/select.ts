import { Command, CommandMessage } from 'discord.js-commando';
import { FuzzySearch } from 'fuzzy-search';
import { GameService, MessageFormatter } from '../services';


export default class Select extends Command {
    constructor(client) {
        super(client, {
            name: 'select',
            group: 'general',
            memberName: 'select',
            description: 'select a choice using either a number or text',
            args: [{
                key: 'choice',
                prompt: 'your choice',
                type: 'string',
            }],
        });
    }

    async select(msg: CommandMessage, { choice }) {
        let gameState = await GameService.checkSave(msg.author.id);
        if (typeof gameState === 'undefined') {
            let payload = `> Hello, ${msg.author.username}.
                           > To start a game of **The Intercept** reply \`!start\`.
                           > To see all commands reply \`!help\``;
            msg.say(payload);
            return;
        }


        let game = await GameService.loadGame(msg.author.id);
        game.ContinueMaximally();

        let text = [];

        while (game.canContinue) {
            let payload = await MessageFormatter.message(game.Continue().trim());
            if (payload.length > 2) text.push(payload);
        }

        if (game.currentChoices.length > 0) {
            let result = [];
            const messageInt = Math.floor(parseInt(choice));
            if (!isNaN(messageInt) && game.currentChoices[messageInt - 1]) {
                result.push(game.currentChoices[messageInt - 1]);
            } else {
                const searcher = new FuzzySearch(game.currentChoices, ['text'], {
                    caseSensitive: false,
                });
                result = await searcher.search(choice);
            }

            if (result.length > 0 && result[0].text.length > 0) {
                game.ChooseChoiceIndex(result[0].index);
                while (game.canContinue) {
                    const payload = await MessageFormatter.message(game.Continue().trim());
                    if (payload.length > 2) text.push(payload);
                }
            } else {
                text.push(MessageFormatter.message('**Pardon?**'));
                text.push(...GameService.getCurrentText(game));
            }
        }

        text.push(...GameService.sendChoices(game));
        msg.say(text.join('\n'));

        await GameService.saveGame(msg.author.id, game);
    }
}
