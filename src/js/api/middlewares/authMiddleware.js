import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const segredo = process.env.JWT_SECRET || 'chave_secreta_padrao';
        const usuarioDecodificado = jwt.verify(token, segredo);
        req.usuario = usuarioDecodificado;
        next();
    } catch (error) {
        return res.status(401).json({ erro: 'Token inválido ou expirado.' });
    }
}
