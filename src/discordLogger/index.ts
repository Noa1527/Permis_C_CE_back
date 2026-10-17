import { Webhook, MessageBuilder } from 'discord-webhook-node';
import getenv from 'getenv';

const hook = new Webhook(
  'https://discord.com/api/webhooks/',
);

export function sendLogsToDiscord(title, project, logDetails, ETAT) {
  const envTitle = getenv('NODE_ENV') === 'production' ? 'PROD' : 'DEV';

  const embed = new MessageBuilder()
    .setTitle(`${title} - ${envTitle}`)
    .setAuthor(project)
    .setColor(ETAT)
    .setDescription(logDetails)
    .setTimestamp();

  hook.send(embed).catch((err) => console.log(err.message));
}