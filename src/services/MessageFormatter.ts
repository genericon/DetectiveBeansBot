import TurndownService from 'turndown';

const turndownService = new TurndownService();

export class MessageFormatter { 
  static message(_message: string): string {
    return `> ${turndownService.turndown(_message)}`;
  }
 
  static choice(choice: any): string {
    return `▸ *${turndownService.turndown(choice.text)}*`;
  }
};
