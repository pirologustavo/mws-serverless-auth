const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0
});

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body || '{}');
        const cpf = body.cpf;

        if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "CPF inválido ou não informado." })
            };
        }

        const cpfLimpo = cpf.replace(/\D/g, '');

        const [rows] = await pool.execute(
            'SELECT id, nome, status FROM clientes WHERE cpf = ? LIMIT 1',
            [cpfLimpo]
        );

        if (rows.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Cliente não encontrado na base de dados." })
            };
        }

        const cliente = rows[0];

        if (cliente.status === 'inativo') {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: "Acesso negado. Cadastro do cliente está inativo." })
            };
        }

        // 4. Geração do Token JWT
        const token = jwt.sign(
            {
                id: cliente.id,
                cpf: cpfLimpo,
                role: 'cliente'
            },
            process.env.JWT_SECRET || 'mws-super-secret-key-fase3',
            { expiresIn: '2h' }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Autenticado com sucesso",
                token: token,
                cliente: {
                    id: cliente.id,
                    nome: cliente.nome
                }
            })
        };

    } catch (error) {
        console.error("Erro na execução da Lambda:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Erro interno na autenticação", error: error.message })
        };
    }
};