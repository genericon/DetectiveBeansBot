import { Command, CommandMessage } from 'discord.js-commando';
import { GameService } from '../services';


export default class Start extends Command {
    constructor(client) {
        super(client, {
            name: 'start',
            group: 'general',
            memberName: 'start',
            description: 'begin a playthrough of *The Intercept*',
        })
    }

    async start(msg: CommandMessage) {
        let gameState = await GameService.checkSave(msg.author.id);
        if (typeof gameState !== 'undefined') {
            let payload = `> Hello, ${msg.author.username}.
                           > You're already playing a game.
                           > To see all commands reply \`!help\``
            msg.say(payload);
            return;
        }

        let game = await GameService.createGame(msg.author.id);
        game.ContinueMaximally();

        let text = [];

        text.push(...GameService.getCurrentText(game));
        text.push(...GameService.sendChoices(game));
        msg.say(text.join('\n'));
    }
}
