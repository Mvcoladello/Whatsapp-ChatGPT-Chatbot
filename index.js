const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { OpenAI } = require("openai"); // Importando a classe OpenAI da biblioteca openai

const client = new Client({
    authStrategy: new LocalAuth()
});

const openai = new OpenAI("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"); // Substitua "SUA_CHAVE_DE_API_DO_OPENAI" pela sua chave de API do OpenAI

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

// Função para enviar uma mensagem para o ChatGPT e retornar a resposta
async function getChatGPTResponse(message) {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: message }],
        model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content;
}

client.on('message_create', async (message) => {
    if (message.fromMe) return; // Ignorar mensagens enviadas pelo próprio bot

    const chatGPTResponse = await getChatGPTResponse(message.body);

    // Enviar a resposta do ChatGPT de volta para o remetente original
    await client.sendMessage(message.from, chatGPTResponse);
});

client.initialize();
