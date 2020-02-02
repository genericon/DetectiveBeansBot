import { Command, CommandMessage } from 'discord.js-commando';
import { GameService } from '../services';


export default class Restart extends Command {
    constructor(client) {
        super(client, {
            name: 'restart',
            group: 'general',
            memberName: 'restart',
            description: 'restart your playthrough of *The Intercept*',
        })
    }

    async restart(msg: CommandMessage) {
        let gameState = await GameService.checkSave(msg.author.id);
        if (typeof gameState === 'undefined') {
            let payload = `> Hello, ${msg.author.username}.
                           > To start a game of **The Intercept** reply \`!start\`.
                           > To see all commands reply \`!help\``
            msg.say(payload);
            return;
        }

        GameService.destroyGame(msg.author.id);
        msg.say('> Game progress forgotten. Restarting game.');

        let game = await GameService.createGame(msg.author.id);
        game.ContinueMaximally();

        let text = [];

        text.push(...GameService.getCurrentText(game));
        text.push(...GameService.sendChoices(game));
        msg.say(text.join('\n'));
    }
}
