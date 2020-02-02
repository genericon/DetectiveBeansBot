# DetectiveBeansBot

This is a prototype Discord Bot that allows users to play through [Ink](https://www.inklestudios.com/ink/) stories.

### Getting it running

- Clone the repo and `npm install`
- Set the appropriate environment variables (or hardcode them in `src/config.ts`)
- `npm start`

### What can it do?

At the moment, not a great deal. 

Players can issue the following commands:

- `!help` - show a list of commands
- `!start` - begin a playthrough of The Intercept.
- `!restart` - restart your playthrough of The Intercept.
- `!forget` - delete your current playthough.
- `!sitrep` - see the last message and your current options.
- `!select` - select a choice using either a number or text.

Progress is saved automatically when each choice is made.

### Roadmap Ideas

- Implement `!select`
- Migrate to [Commando](https://github.com/discordjs/Commando)
- Implement Global User State set using tags (for multi-part CYOA)
- Implement multiple story selection (for multi-part CYOA)
