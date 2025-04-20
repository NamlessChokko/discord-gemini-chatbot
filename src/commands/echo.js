module.exports = {
    name: 'echo',
    description: 'Gemini repetirá lo que le digas',
    options: [
    {
        name: 'mensaje',
        type: 3, // STRING
        description: 'Lo que quieres que Gemini repita',
        required: true,
    },
    ],
    async execute(interaction, client) {
    const mensaje = interaction.options.getString('mensaje');

    try {
        const model = client.gemini.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(mensaje);
        const reply = await result.response.text();
        await interaction.reply(reply);
    } catch (err) {
        console.error('Error en /echo:', err);
        await interaction.reply({ content: 'Hubo un error con Gemini 😥', ephemeral: true });
    }
    },
};
