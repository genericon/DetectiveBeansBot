import * as inkjs from 'inkjs';
import { getRepository, Repository } from 'typeorm';

import { MessageFormatter } from './MessageFormatter';

import { State } from '../entity/State';


export class GameService {
  repo: Repository<State>;
  storyData: any;

  constructor(storyData: any) {
    this.repo = getRepository(State);
    this.storyData = storyData;
  }

  async checkSave(userId: string): Promise<State|undefined> {
    return await this.repo.findOne(userId);
  }

  async loadGame(userId: string): Promise<inkjs.Story> {
    const game = new inkjs.Story(this.storyData);
    const gameData = await this.repo.findOne(userId);
    game.state.jsonToken = gameData.state;
    return game;
  }

  async createGame(userId: string): Promise<inkjs.Story> {
    const game = new inkjs.Story(this.storyData);
    await this.repo.insert({
      uuid: userId,
      state: game.state.jsonToken
    });
    return game;
  }
  
  async saveGame(userId: string, game) {
    return await this.repo.update(userId, {
      state: game.state.jsonToken
    });
  }
  
  async destroyGame(userId: string) {
    return this.repo.delete(userId);
  }
  
  sendChoices(message, game): string[] {
    return game.currentChoices.map(choice => 
      MessageFormatter.choice(choice)
    ).filter(payload => (payload.length > 0));
  }
  
  getCurrentText(game): string[] {
    return [
      MessageFormatter.message(game.currentText.trim())
    ].filter(text => (text.length > 2));
  }
};
