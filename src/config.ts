/**
 * Discord bot config.
 *
 * Revisions to this file should not be committed to the repository.
 */
export type BotConfig = {
  /** the Discord bot token. */
  token: string,
  /** The path to the story directory */
  story_dir: string,
};

export let config: BotConfig = {
  token: process.env['DISCORD_BOT_TOKEN'],
  story_dir: process.env['DISCORD_BOT_STORY_DIR'] || "../stories/",
};
