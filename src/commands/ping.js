const { Client } = require('discord.js');
async function ping(Client) {
   try {
    Client.on('messageCreate', ()=> {
        if(message.author.bot) return; // para que no se responda solo (ignora sus propios mensajes)

        if(messge.content == 'ping'){
           await message.reply('why ping?? be original LMAFOoO')
          await  console.log('palabra "ping" leida corectamente') // vamos a ver si lee los mensajes o si el comando esta bien
        }
    } ) 
   } catch (error) {
    console.log(error);
   await message.channel.send('something is incorrect please read the logs...')
   }
} 


module.exports = ping(Client);