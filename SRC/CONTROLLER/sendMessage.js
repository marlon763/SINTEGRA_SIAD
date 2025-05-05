const sendMessage = async (req, res) => {
    try {
      const { sessionId, phoneNumber, message, file } = req.body;
      
      // Validações básicas
      if (!sessionId || !phoneNumber) {
        return res.status(400).json({ error: "Sessão e número de telefone são obrigatórios" });
      }
      
      if (!message && !file) {
        return res.status(400).json({ error: "É necessário fornecer uma mensagem ou um arquivo" });
      }
      
      // Busca a sessão
      const sessionData = sessionsData.db.find(sess => sess.id === sessionId);
      if (!sessionData) {
        return res.status(404).json({ error: "Sessão não encontrada" });
      }
      
      const client = sessionData.client;
      if (!client) {
        return res.status(500).json({ error: "Cliente não inicializado corretamente" });
      }
      
      // Formata o número do telefone (adiciona @c.us se necessário)
      const formattedNumber = phoneNumber.includes('@c.us') ? 
        phoneNumber : `${phoneNumber}@c.us`;
      
      // Envia a mensagem ou arquivo
      let result;
      
      if (message) {
        result = await client.sendText(formattedNumber, message);
      }
      
      if (file) {
        // Implementação depende de como você está tratando arquivos
        result = await client.sendFile(
          formattedNumber,
          file.data,
          file.filename || 'arquivo',
          file.caption || ''
        );
      }
      
      return res.status(200).json({
        status: "success",
        message: "Mensagem enviada com sucesso",
        data: result
      });
      
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      return res.status(500).json({ message: "Falha ao enviar mensagem: "});
    }
};