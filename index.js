const jwt = require('jsonwebtoken');

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

        const token = jwt.sign(
            { cpf: cpfLimpo, role: 'cliente' },
            process.env.JWT_SECRET || 'mws-super-secret-key-fase2',
            { expiresIn: '2h' }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Autenticado com sucesso", token: token })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Erro interno", error: error.message })
        };
    }
};