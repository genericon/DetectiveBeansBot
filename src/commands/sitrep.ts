import { Command, CommandMessage } from 'discord.js-commando';
import { GameService } from '../services';


export default class Sitrep extends Command {
    constructor(client) {
        super(client, {
            name: 'sitrep',
            group: 'general',
            memberName: 'sitrep',
            description: 'see the last message and your current options',
        })
    }

    async sitrep(msg: CommandMessage) {
        let gameState = await GameService.checkSave(msg.author.id);
        if (typeof gameState === 'undefined') {
            let payload = `> Hello, ${msg.author.username}.
                           > To start a game of **The Intercept** reply \`!start\`.
                           > To see all commands reply \`!help\``
            msg.say(payload);
            return;
        }

        let game = await GameService.loadGame(msg.author.id);
        game.ContinueMaximally();

        let text = [];

        text.push(...GameService.getCurrentText(game));
        text.push(...GameService.sendChoices(game));
        msg.say(text.join('\n'));
    }
}
