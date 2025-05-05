const venom = require('venom-bot');
const knex = require("../DATA/connection");
const sessionsData  = require("../DATA/bancoSessoes");
const {autoSendMessage} = require("../VENOM/autoVenom");

const { getIo } = require("../SERVICES/socketio");

//=================================================================[gambiarra para respeitar o maxAttempts: 1]=============================================================================
//quando o multidevice esta ativo (true) nao respeita o maxAttempts......bug na biblioteca
//gambiarra tbm nao funcionou, estudar outra forma
// let qrCodeAttempts = 0;
// const maxAttempts = 2;

//função para criação de cliente venom para controle de mensagens 
const initializeClient = async (req, res) => {
    try {
        const { id } = req.params;

        //verifica se o canal está cadastrado atraves do id para evitar envio de id inexistente==========[retonrna a primeira ocorrencia do id]
        const sessao = await knex("canais").where({id}).first();

        if (!sessao) {
            return res.status(404).json({ error: "Canal não cadastrado"});
        };

        // Verifica se a sessão já está inicializada
        if (sessionsData.db.find((sess) => sess.session === id)) {
            return res.status(400).json({ error: "Sessão já inicializada" });
        };

        const io = getIo();

        try {
            //console.log(`Iniciando criação de cliente para sessão ${sessao.nome}`);
            
            const client = await venom.create(
                {
                    session: sessao.nome,
                    autoClose: false,
                    multidevice: true,
                    debug: true,
                    logQR: false,
                    // Usar "new" headless em vez do modo headless antigo para melhor compatibilidade com chrome novo
                    puppeteerOptions: {
                        headless: "new", // Este é o modo headless moderno
                        timeout: 60000, // aguarda 60 segundos antes de gerar erro ao abrir o navegaddor
                        args: [
                            "--no-sandbox", 
                            "--disable-setuid-sandbox",
                            "--disable-dev-shm-usage",
                            "--disable-accelerated-2d-canvas",
                            "--no-first-run",
                            "--disable-extensions",
                            "--disable-gpu"
                        ]
                    },
                    browserArgs: [
                        "--no-sandbox", 
                        "--disable-setuid-sandbox"
                    ],
                },
                (base64Qr) => {
                    
                    //console.log(`QR Code gerado para sessão ${sessao.nome}`);
                        io.emit("Get-QR-Code", { sessao, base64Qr });
                },
            );
            //console.log(`Cliente criado com sucesso para sessão ${sessao.nome}`);

            // Armazena a sessão dinamicamente
            sessionsData.db.push({
                id,  
                session: sessao.nome,
                client
            });

            sessionMonitor(client, sessao.nome, io);

            autoSendMessage(client, sessao.nome)

            return res.status(200).json({ 
                status: "success", 
                message: "Sessão iniciada com sucesso" 
            });
            
        } catch (error) {
            console.error(`Erro na criação da sessão ${sessao.nome}:`, error);
            return res.status(500).json({message: "Falha ao criar sessão: " + error.message});
        }

    } catch (error) {
        console.error("Erro ao inicializar a sessão:", error.message);
        return res.status(500).json({ message: "Erro interno do servidor"})
    }
};

//monitora o status da sessao em caso for desconectado
const sessionMonitor = (client, nome, io) => {
    try {
        // Monitora mudanças de estado do cliente
        client.onStateChange(state => {
            if (state === "DISCONNECTED") {
                client.close()
                    .then(() => {
                        const index = sessionsData.db.findIndex(session => session.session === nome);

                        if (index !== -1) {
                            sessionsData.db.splice(index, 1); // Remove a sessão do array
                            //console.log(`Sessão '${nome}' removida com sucesso!`);
                        }
                        
                        io.emit("clientStatus", { nome, estado: state });
                    })
                    .catch((error) => {
                        console.error("Erro ao fechar o cliente:", error);
                    });
            } else {
                io.emit("clientStatus", { nome, estado: state });
            }
        });
    } catch (error) {
        console.error("Erro ao monitorar a sessão:", error.message);
    }
}

// Exporta as funções
module.exports = { 
    initializeClient
};