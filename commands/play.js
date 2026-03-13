const yts = require('yt-search');

async function playCommand(sock, chatId, senderId, messageText, replyMessage, message) {
    if (!messageText) {
        await sock.sendMessage(chatId, { text: '❌ Scrivi il titolo di una canzone!\nEsempio: *.play Simba La Rue*' }, { quoted: message });
        return;
    }

    try {
        const search = await yts(messageText);
        const video = search.videos[0];

        if (!video) {
            await sock.sendMessage(chatId, { text: '❌ Nessun risultato trovato su YouTube.' }, { quoted: message });
            return;
        }

        let caption = `🎵 *CANZONE TROVATA*\n\n📌 *Titolo:* ${video.title}\n⏱️ *Durata:* ${video.timestamp}\n👤 *Canale:* ${video.author.name}\n\n📥 _Invio in corso..._`;
        
        // Invia l'anteprima
        await sock.sendMessage(chatId, { 
            image: { url: video.thumbnail }, 
            caption: caption 
        }, { quoted: message });

        // Invia l'audio direttamente
        await sock.sendMessage(chatId, { 
            audio: { url: video.url }, 
            mimetype: 'audio/mp4',
            fileName: `${video.title}.mp3`
        }, { quoted: message });

    } catch (e) {
        console.log(e);
        await sock.sendMessage(chatId, { text: '❌ Errore durante il caricamento. Riprova.' }, { quoted: message });
    }
}

module.exports = playCommand;/
