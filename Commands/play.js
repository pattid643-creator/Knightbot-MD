const yts = require('yt-search');
async function playCommand(sock, chatId, senderId, messageText, replyMessage, message) {
    if (!messageText) return await sock.sendMessage(chatId, { text: '❌ Scrivi il titolo di una canzone!' }, { quoted: message });
    try {
        const search = await yts(messageText);
        const video = search.videos[0];
        if (!video) return await sock.sendMessage(chatId, { text: '❌ Nulla trovato.' }, { quoted: message });
        await sock.sendMessage(chatId, { image: { url: video.thumbnail }, caption: `🎵 *${video.title}*\n⏱️ *${video.timestamp}*\n📥 Invio...` }, { quoted: message });
        await sock.sendMessage(chatId, { audio: { url: video.url }, mimetype: 'audio/mp4' }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Errore.' });
    }
}
module.exports = playCommand;
