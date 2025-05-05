const banco = require("../DATA/banco")

const handleTickets = (req , res) => {
    try {
        const db = banco.db
        let tickets = []

        for (const tkts of db) {
            tickets.push(
                {
                    img : tkts.img,
                    from : tkts.num,
                    nome : tkts.nome,
                    id : tkts.ticket.id,
                    ultimaMensagem :tkts.dados[tkts.dados.length - 1].texto,
                    mensagens : tkts.dados,
                    horario : tkts.dados[tkts.dados.length - 1].horario,
                    status : tkts.ticket.status,
                  }
            )
        }

        //console.log(tickets)

        // const obj = {
        //     img,
        //     from,
        //     nome : nome,
        //     id : cliente.ticket,
        //     ultimaMensagem : texto,
        //     mensagens : cliente.dados,
        //     horario : horarioFormatado,
        //     status : cliente.ticket.status,
        //   }

        return res.status(200).json({tickets})
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

module.exports = {
    handleTickets
};