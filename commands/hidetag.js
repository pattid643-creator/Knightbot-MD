const isAdmin = require('../lib/isAdmin');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

async function downloadMediaMessage(message, mediaType) {
    const stream = await downloadContentFromMessage(message, mediaType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    const filePath = path.join(__dirname, '../temp/', `${Date.now()}.${mediaType}`);
    if (!fs.existsSync(path.join(__dirname, '../temp/'))) {
        fs.mkdirSync(path.join(__dirname, '../temp/'));
    }
    fs.writeFileSync(filePath, buffer);
    return filePath;
}

async function hideTagCommand(sock, chatId, senderId, messageText, replyMessage, message) {
    const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);

    if (!isBotAdmin) {
        await sock.sendMessage(chatId, { text: '❌ Errore: Il bot deve essere admin.' }, { quoted: message });
        return;
    }

    if (!isSenderAdmin) {
        await sock.sendMessage(chatId, { text: '❌ Solo gli admin possono usare questo comando.' }, { quoted: message });
        return;
    }

    const groupMetadata = await sock.groupMetadata(chatId);
    const participants = groupMetadata.participants || [];
    // Ora tagga TUTTI i membri (non solo i non-admin)
    const allMembers = participants.map(p => p.id);

    if (replyMessage) {
        let content = {};
        if (replyMessage.imageMessage) {
            const filePath = await downloadMediaMessage(replyMessage.imageMessage, 'image');
            content = { image: { url: filePath }, caption: messageText || replyMessage.imageMessage.caption || '', mentions: allMembers };
        } else if (replyMessage.videoMessage) {
            const filePath = await downloadMediaMessage(replyMessage.videoMessage, 'video');
            content = { video: { url: filePath }, caption: messageText || replyMessage.videoMessage.caption || '', mentions: allMembers };
        } else if (replyMessage.conversation || replyMessage.extendedTextMessage) {
            const text = replyMessage.conversation || replyMessage.extendedTextMessage.text;
            content = { text: text, mentions: allMembers };
        } else if (replyMessage.documentMessage) {
            const filePath = await downloadMediaMessage(replyMessage.documentMessage, 'document');
            content = { document: { url: filePath }, fileName: replyMessage.documentMessage.fileName, caption: messageText || '', mentions: allMembers };
        }

        if (Object.keys(content).length > 0) {
            await sock.sendMessage(chatId, content);
        }
    } else {
        // Messaggio di testo semplice se non stai rispondendo a nulla
        await sock.sendMessage(chatId, { text: messageText || '📢 Annuncio a tutti i membri!', mentions: allMembers });
    }
}

module.exports = hideTagCommand;
