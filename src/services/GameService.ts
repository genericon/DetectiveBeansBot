import * as fs from 'fs';
import * as inkjs from 'inkjs';
import { getRepository, Repository } from 'typeorm';
import { MessageFormatter } from './MessageFormatter';
import { State } from '../entity/State';
import { config } from '../config';


export class GameService {
  static storyData: any;

  static loadGameFile(): void {
    let filename = config.story_dir + '/intercept.json';
    GameService.storyData = fs.readFileSync(filename);
  }

  static get repo(): Repository<State> {
    return getRepository(State);
  }

  static async checkSave(userId: string): Promise<State|undefined> {
    return await GameService.repo.findOne(userId);
  }

  static async loadGame(userId: string): Promise<inkjs.Story> {
    const game = new inkjs.Story(GameService.storyData);
    const gameData = await GameService.repo.findOne(userId);
    game.state.jsonToken = gameData.state;
    return game;
  }

  static async createGame(userId: string): Promise<inkjs.Story> {
    const game = new inkjs.Story(GameService.storyData);
    await GameService.repo.insert({
      uuid: userId,
      state: game.state.jsonToken,
      story_filename: ''
    });
    return game;
  }
  
  static async saveGame(userId: string, game) {
    return await GameService.repo.update(userId, {
      state: game.state.jsonToken
    });
  }
  
  static async destroyGame(userId: string) {
    return GameService.repo.delete(userId);
  }
  
  static sendChoices(game): string[] {
    return game.currentChoices.map(choice => 
      MessageFormatter.choice(choice)
    ).filter(payload => (payload.length > 0));
  }
  
  static getCurrentText(game): string[] {
    return [
      MessageFormatter.message(game.currentText.trim())
    ].filter(text => (text.length > 2));
  }
};
