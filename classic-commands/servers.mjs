import {
    MessageEmbed,
} from 'discord.js';

// Admin only command that returns the servers and the reach the bot has
const servers = (message, client) => {
    // The the message comes from a user other than the bot admin, return
    if (!process.env.ADMIN_ID || !process.env.ADMIN_ID.split(',').includes(message.author.id)) {
        return false;
    }

    const sendTo = message.fallbackChannel || message.channel;
    const embed = new MessageEmbed();
    let serverCount = 0;
    let reach = 0;

    client.guilds.cache.each(server => {
        serverCount = serverCount + 1;
        let serverUsers = 0;
        server.members.cache.each(member => {
            if (!member.user.bot) {
                serverUsers++;
            }
        });
        reach += serverUsers;
    });
    embed.setTitle(`Servers (${serverCount})`);
    embed.setDescription(`Total reach: ${reach.toLocaleString()} users`);

    if (embed.length == 0) {
        message.react('❌');

        return true;
    }

    sendTo.send({ embeds: [embed] })
        .catch(console.error);
};

export default servers;
