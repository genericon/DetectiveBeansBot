import { Command, CommandMessage } from 'discord.js-commando';
import { GameService } from '../services';


export default class Forget extends Command {
    constructor(client) {
        super(client, {
            name: 'forget',
            group: 'general',
            memberName: 'forget',
            description: 'delete your current playthough',
        })
    }

    async forget(msg: CommandMessage) {
        let gameState = await GameService.checkSave(msg.author.id);
        if (typeof gameState === 'undefined') {
            let payload = `> Hello, ${msg.author.username}.
                           > To start a game of **The Intercept** reply \`!start\`.
                           > To see all commands reply \`!help\``
            msg.say(payload);
            return;
        }

        GameService.destroyGame(msg.author.id);
        msg.say('> Game progress forgotten. Reply `!start` to begin a new game.');
    }
}
