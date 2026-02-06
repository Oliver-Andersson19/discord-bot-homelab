// src/commands/ping.js
export default {
  name: 'ping',
  description: 'Replies with Pong!',
  async execute(message, args) {
    await message.reply('Pong!');
  },
};
