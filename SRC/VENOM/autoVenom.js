//     financeiro {
//     gerar boleto => primeira e segunda via
//     consultar status
//     debloqueio de confiança
//     falar com atendente
//     voltar nas opt anteriores
//     }

//     comercial {
//     sistema gerencial => marque a demonstracao
//     sistema gerencial/fiscal => marque a demonstracao
//     plano fidelidade => planos padrões com fidelidade de tempo ganha desconto, e em caso de quebra de contrato paga uma multa 
//     {plano 6 meses ganha desconto na parcela com uma porcentagem menor,plano 1 ano desconto maior na parcela e um desconto na implantação mas em caso de evasão tem maior multa} => marque a demonstracao
//     falar com atendente
//     voltar nas opt anteriores
//     }
    
//     nossa empresa => {
//     site 
//     localização
//     numero de cada empresa
    
//     falar com atendente
//     voltar nas opt anteriores
//     }
    
//     suporte ao cliente => [treinar uma ia para passar por ela antes] => redirecionar para um atendente

// colatina @-19.5268914,-40.6314104   X

// carangola @-20.7298932,-42.0217229    X

// aimores @-19.4916757,-41.0614875   X

// cp @-19.1734092,-41.4731886   X
 
const path = require('path');
const banco = require("../DATA/banco");
const {  v4 : uuidv4  } = require ( 'uuid' );
const { getIo } = require("../SERVICES/socketio");

const menus = {
    principal: {
      mensagem: "Seja bem-vindo ao canal de atendimento SIAD Sistemas. Escolha uma opção:\n\n1️⃣ Financeiro\n2️⃣ Comercial\n3️⃣ Nossa empresa\n4️⃣ Suporte ao cliente",
    },
    "1" : {
      mensagem: "Você está no setor Financeiro. Escolha uma opção:\n\n1️⃣ Gerar boleto\n2️⃣ Consultar status\n3️⃣ Desbloqueio de confiança\n4️⃣ Falar com atendente\n0️⃣ Voltar ao menu principal",
    },
    "2" : {
      mensagem: "Você está no setor Comercial. Escolha uma opção:\n\n1️⃣ Sistema gerencial\n2️⃣ Sistema gerencial/fiscal\n3️⃣ Plano fidelidade\n4️⃣ Falar com atendente\n0️⃣ Voltar ao menu principal",
    },
    "3" : {
      mensagem: "Informações sobre a empresa. Escolha uma opção:\n\n1️⃣ Nosso site\n2️⃣ Redes sociais\n3️⃣ Localização das nossas filiais\n0️⃣ Voltar ao menu principal",
    },
    "4" : {
      mensagem: "Você está no setor de Suporte ao cliente. Escolha uma opção:\n\n1️⃣ Dúvidas técnicas\n2️⃣ Problemas de acesso\n3️⃣ Solicitar treinamento\n4️⃣ Falar com atendente\n0️⃣ Voltar ao menu principal",
    },
    // Submenus do Financeiro
    "1.1": {
      mensagem: "0️⃣ Voltar ao menu anterior",
    },
    "1.2": {
      mensagem: "Para consultar o status de pagamento, por favor informe o código do cliente ou CNPJ/CPF:\n\n0️⃣ Voltar ao menu anterior",
    },
    "1.3": {
      mensagem: "Para solicitar desbloqueio de confiança, por favor informe o código do cliente ou CNPJ/CPF:\n\n0️⃣ Voltar ao menu anterior",
    },
    "1.4": {
      mensagem: "Aguarde um momento, você será transferido para um atendente do setor financeiro.",
    },
    // Submenus do Comercial
    "2.1": {
      mensagem: "Informações sobre Sistema gerencial:\n\nO Sistema Gerencial SIAD oferece controle de estoque, vendas, financeiro e muito mais.\n\nDeseja receber mais informações?\n\n1️⃣ Sim, quero receber a proposta\n0️⃣ Voltar ao menu anterior",
    },
    "2.2": {
      mensagem: "Informações sobre Sistema gerencial/fiscal:\n\nO Sistema Gerencial/Fiscal SIAD completo oferece todos os recursos gerenciais mais emissão de NF-e, NFC-e, MDF-e e CT-e.\n\nDeseja receber mais informações?\n\n1️⃣ Sim, quero receber a proposta\n0️⃣ Voltar ao menu anterior",
    },
    "2.3": {
      mensagem: "Informações sobre Plano fidelidade:\n\nO Plano Fidelidade SIAD oferece descontos especiais e suporte prioritário.\n\nDeseja receber mais informações?\n\n1️⃣ Sim, quero receber a proposta\n0️⃣ Voltar ao menu anterior",
    },
    "2.4": {
      mensagem: "Aguarde um momento, você será transferido para um atendente do setor comercial.",
    },
    // Submenus da Nossa empresa
    "3.1": {
      mensagem: "Visite nosso site: https://siadvendas.com.br/\n\n0️⃣ Voltar ao menu anterior",
    },
    "3.2": {
      mensagem: "Visite nossas redes sociais: https://www.instagram.com/siadsistemasbr?igsh=aWkzMnF4dmxpMG5w \n\n0️⃣ Voltar ao menu anterior",
    },
    "3.3": {
      mensagem: "Escolha qual filial vc deseja:\n\n1️⃣ Aimores\n2️⃣ Carangola\n3️⃣ Colatina\n4️⃣ Conselheiro pena\n5️⃣ Todas as filiais\n\n0️⃣ Voltar ao menu anterior",
    },
    "3.3.1": {
      mensagem: "Faça-nos uma visita e conheça nosso trabalho!\n\n0️⃣ Voltar ao menu anterior",
      localizacao: {
        latitude: -19.491675,
        longitude: -41.0614875,
        cidade : "Aimores"
      }
    },
    "3.3.2": {
      mensagem: "Faça-nos uma visita e conheça nosso trabalho!\n\n0️⃣ Voltar ao menu anterior",
      localizacao: {
        latitude: -20.7298932,
        longitude: -42.0217229,
        cidade : "Carangola"        
      }
    },
    "3.3.3": {
      mensagem: "Faça-nos uma visita e conheça nosso trabalho!\n\n0️⃣ Voltar ao menu anterior",
      localizacao: {
        latitude: -19.5268914,
        longitude: -40.6314104,
        cidade : "Colatina"
      }
    },
    "3.3.4": {
      mensagem: "Faça-nos uma visita e conheça nosso trabalho!\n\n0️⃣ Voltar ao menu anterior",
      localizacao: {
        latitude: -19.1734092,
        longitude: -41.4731886,
        cidade : "Conselheiro Pena"
      }
    },
    "3.3.5": {
      mensagem: "Faça-nos uma visita e conheça nosso trabalho!\n\n0️⃣ Voltar ao menu anterior",
      localizacoes: [
        { latitude: -19.1734092, longitude: -41.4731886 ,cidade : "Aimores"},
        { latitude: -20.7298932, longitude: -42.0217229 ,cidade : "Carangola"},
        { latitude: -19.5268914, longitude: -40.6314104 ,cidade : "Colatina"},
        { latitude: -19.1734092, longitude: -41.4731886 ,cidade : "Conselheiro Pena"}
      ]
    },
    // Submenus do Suporte
    // "4.1": {
    //   mensagem: "Para dúvidas técnicas, por favor descreva brevemente seu problema:\n\n0️⃣ Voltar ao menu anterior",
    // },
    // "4.2": {
    //   mensagem: "Para problemas de acesso, por favor informe seu usuário e detalhes do problema:\n\n0️⃣ Voltar ao menu anterior",
    // },
    // "4.3": {
    //   mensagem: "Para solicitar treinamento, por favor informe o módulo desejado e quantas pessoas participarão:\n\n0️⃣ Voltar ao menu anterior",
    // },
    // "4.4": {
    //   mensagem: "Aguarde um momento, você será transferido para um atendente do suporte técnico.\n\n0️⃣ Voltar ao menu anterior",
    // },
};

const processarMensagem = async (client, message) => {

    try {
        const from = message.from;
        const texto = message.body.trim();
        const cliente = banco.db.find((numero) => numero.num === from);

        const proximoMenu = cliente.menuAtual === 'principal' ? texto : `${cliente.menuAtual}.${texto}`;

        if (texto === "0") {
            // Divide o caminho do menu e remove o último nível
            const menuAnterior = cliente.menuAtual.split('.').slice(0, -1).join('.') || 'principal';
            cliente.menuAtual = menuAnterior;
            await client.sendText(from, menus[menuAnterior].mensagem);
            return
        };
    
        if ((!menus[proximoMenu] && cliente.menuAtual !== 'principal') || (!menus[proximoMenu] && !menus[cliente.menuAtual])) {
            // Opção inválida
            cliente.menuAtual = 'principal'
            await client.sendText(from, `Opção inválida. Por favor, escolha uma das opções disponíveis.`);
            await client.sendText(from, menus.principal.mensagem);
            return
        };

        if (menus[proximoMenu]) {

            cliente.menuAtual = proximoMenu

            switch(proximoMenu){
                case "1":
                    await client.sendText(from, menus['1'].mensagem);
                break
        
                case "2":
                    await client.sendText(from, menus['2'].mensagem);
                break
        
                case "3":
                    await client.sendText(from, menus['3'].mensagem);
                break
        
                case "4":
                    //await client.sendText(from, menus['4'].mensagem);
                    const ticket = uuidv4()
                    cliente.ticket.id = ticket
                    cliente.Atendimento = true
                    await client.sendText(from, `Aguarde um momento, você será transferido para um atendente do suporte.\n\nTicket 🎟 : ${ticket}`);
                break
        
                case "1.1": 
                const filePath = path.resolve(__dirname, 'BOLETO/boleto_exemplo.pdf');
                await client.sendFile(
                    from, // Número de telefone com DDI e DDD + "@c.us"
                    filePath, // Caminho para o arquivo local
                    'BOLETO.pdf',      // Nome do arquivo no WhatsApp
                    'Segue o documento em PDF.' // Mensagem opcional junto ao arquivo
                );
                await client.sendText(from, menus[cliente.menuAtual].mensagem);
                break

                case "1.2":
                  await client.sendText(from, "Opção ainda em desenvolvimento ⚙\n\n0️⃣ Voltar ao menu anterior");
                break

                case "1.3":
                  await client.sendText(from, "Opção ainda em desenvolvimento ⚙\n\n0️⃣ Voltar ao menu anterior");
                break

                case "1.4":
                  cliente.Atendimento = true
                  await client.sendText(from, menus[cliente.menuAtual].mensagem);
                break

                case "2.1":
                  await client.sendText(from, "Opção ainda em desenvolvimento ⚙\n\n0️⃣ Voltar ao menu anterior");
                break

                case "2.2":
                  await client.sendText(from, "Opção ainda em desenvolvimento ⚙\n\n0️⃣ Voltar ao menu anterior");
                break

                case "2.3":
                  await client.sendText(from, "Opção ainda em desenvolvimento ⚙\n\n0️⃣ Voltar ao menu anterior");
                break

                case "2.4":
                  cliente.Atendimento = true
                  await client.sendText(from, menus[cliente.menuAtual].mensagem);
                break

                case "3.1":
                  await client.sendText(from, menus[cliente.menuAtual].mensagem);
                break

                case "3.2":
                  await client.sendText(from, menus[cliente.menuAtual].mensagem);
                break

                case "3.3":
                  await client.sendText(from, menus[cliente.menuAtual].mensagem);
                break

                case "3.3.1":
                  await client.sendLocation(
                    from, 
                    menus[cliente.menuAtual].localizacao.latitude, 
                    menus[cliente.menuAtual].localizacao.longitude, 
                    menus[cliente.menuAtual].localizacao.cidade)
                  .then((result) => {
                    console.log('Result: ', result);
                  })
                  .catch((erro) => {
                    //console.error('Error when sending: ', erro);
                  });
                  await client.sendText(from, menus[cliente.menuAtual].mensagem);
                break

                case "3.3.2":
                  await client.sendLocation(
                    from, 
                    menus[cliente.menuAtual].localizacao.latitude, 
                    menus[cliente.menuAtual].localizacao.longitude, 
                    menus[cliente.menuAtual].localizacao.cidade)
                  .then((result) => {
                    console.log('Result: ', result);
                  })
                  .catch((erro) => {
                    //console.error('Error when sending: ', erro);
                  });
                  await client.sendText(from, menus[cliente.menuAtual].mensagem);
                break

                case "3.3.3":
                  await client.sendLocation(
                    from, 
                    menus[cliente.menuAtual].localizacao.latitude, 
                    menus[cliente.menuAtual].localizacao.longitude, 
                    menus[cliente.menuAtual].localizacao.cidade)
                  .then((result) => {
                    console.log('Result: ', result);
                  })
                  .catch((erro) => {
                    //console.error('Error when sending: ', erro);
                  });
                  await client.sendText(from, menus[cliente.menuAtual].mensagem);
                break

                case "3.3.4":
                  await client.sendLocation(
                    from, 
                    menus[cliente.menuAtual].localizacao.latitude, 
                    menus[cliente.menuAtual].localizacao.longitude, 
                    menus[cliente.menuAtual].localizacao.cidade)
                  .then((result) => {
                    console.log('Result: ', result);
                  })
                  .catch((erro) => {
                    //console.error('Error when sending: ', erro);
                  });
                  await client.sendText(from, menus[cliente.menuAtual].mensagem);
                break

                case "3.3.5":

                //console.log(cliente.menuAtual)

                for (const loc of menus[cliente.menuAtual].localizacoes) {
                  await client.sendLocation(from, loc.latitude, loc.longitude, loc.cidade)
                    .then((result) => console.log('Result:', result))
                    .catch((erro) => {
                      //console.error('Error when sending: ', erro);, erro)
                    });
                }
                  await client.sendText(from, menus[cliente.menuAtual].mensagem);
                break

            }; 
            return
        };
    } catch (error) {
        console.error(error)
        //await client.sendText(from, `Erro ao processar mensagem, tente novamente`); 
    }
};


async function escutar(client, message) {
    const TEMPO_ESPERA = 15 * 60 * 1000;
    let cliente = banco.db.find((u) => u.num === message.from);
  
    if (!cliente) {
      // Envia mensagem de boas-vindas
      await client.sendText(message.from, menus.principal.mensagem);
  
      // Cria novo cliente com temporizador
      const temporiozador = setTimeout(() => {
        client.sendText(message.from, "Encerrando o atendimento por inatividade. Obrigado por conversar conosco!");
        // Remove o cliente do banco (opcional) ou apenas o temporizador
        const idx = banco.db.findIndex(u => u.num === message.from);
        if (idx !== -1) {
          banco.db[idx].temporiozador = null;
        }
      }, TEMPO_ESPERA);
  
      cliente = {
        ticket : {
          id : null,
          status : 'entrada',
        },
        dados : [],
        temporiozador,
        num : message.from,
        Atendimento : false,
        esperandoDados : false,
        menuAtual : 'principal',
        nome : message.sender.pushname,
        img : message.sender.profilePicThumbObj.eurl,
      };
  
      banco.db.push(cliente);
    }

    // Se já existe, cancela o temporizador antigo
    clearTimeout(cliente.temporiozador);
  
    // Define um novo temporizador
      cliente.temporiozador = setTimeout(() => {
        client.sendText(
          message.from,
          "Encerrando o atendimento por inatividade. Obrigado por conversar conosco!"
        );
        delete cliente.temporiozador;
    }, TEMPO_ESPERA);
    
    return;
}


function autoSendMessage(client, sessionName) {
    client.onMessage(async (message) => {

      //verifica se a mensagem é de algum grupo, status ou se o cliente esta em um atendimento para ignorar a mensagem
      if (message.isGroupMsg || message.from === "status@broadcast") return;

      await escutar(client, message);

      const from = message.from;      
      const cliente = banco.db.find((numero) => numero.num === from);

      if (cliente.Atendimento === true) {

        const horario = (timestamp) => {
          const data = new Date(timestamp * 1000);
          return data.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        };

        const texto = message.body.trim();
        // const nome = message.sender.pushname;
        // const img = message.sender.profilePicThumbObj.eurl;
        const horarioFormatado = horario(message.timestamp);

        cliente.dados.push({
          texto, 
          enviado: false, 
          horario: horarioFormatado
        })

        const obj = {
          img : cliente.img,
          from,
          nome : cliente.nome,
          id : cliente.ticket,
          ultimaMensagem : texto,
          mensagens : cliente.dados,
          horario : horarioFormatado,
          status : cliente.ticket.status,
        }

        //console.log(horarioFormatado)
        // console.log(cliente.ticket)
        // console.log(obj)

        const io = getIo();

        io.emit("mensagem-chat", obj);

        return
      }
      //
      await processarMensagem(client, message);
    });
}
module.exports = {
    autoSendMessage
};