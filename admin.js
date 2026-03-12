                     module.exports = {
name: "admin",
alias: ["mute","unmute","kick","promote","demote","tagall"],
category: "group",
desc: "Admin commands",

async execute(sock, m, args) {

const text = m.body

// MUTE
if (text.startsWith(".mute")) {
await sock.groupSettingUpdate(m.chat, "announcement")
m.reply("🔒 Gruppo chiuso (solo admin possono scrivere)")
}

// UNMUTE
if (text.startsWith(".unmute")) {
await sock.groupSettingUpdate(m.chat, "not_announcement")
m.reply("🔓 Gruppo aperto")
}

// KICK
if (text.startsWith(".kick")) {
let user = m.mentionedJid[0]
await sock.groupParticipantsUpdate(m.chat, [user], "remove")
m.reply("👢 Utente rimosso")
}

// PROMOTE
if (text.startsWith(".promote")) {
let user = m.mentionedJid[0]
await sock.groupParticipantsUpdate(m.chat, [user], "promote")
m.reply("⬆️ Utente promosso admin")
}

// DEMOTE
if (text.startsWith(".demote")) {
let user = m.mentionedJid[0]
await sock.groupParticipantsUpdate(m.chat, [user], "demote")
m.reply("⬇️ Utente rimosso da admin")
}

// TAGALL
if (text.startsWith(".tagall")) {
let group = await sock.groupMetadata(m.chat)
let members = group.participants
let teks = "📢 TAG ALL\n\n"

for (let mem of members) {
teks += "@" + mem.id.split("@")[0] + "\n"
}

sock.sendMessage(m.chat, { text: teks, mentions: members.map(a => a.id) })
}

}
                     }           
