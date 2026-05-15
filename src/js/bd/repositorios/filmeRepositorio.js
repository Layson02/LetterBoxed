import { Op } from 'sequelize';
import { Filme as FilmeModel, Avaliacao as AvaliacaoModel } from '../../models/index.js';
import Filme from '../../entidades/filme.js';

export class FilmeRepositorio {
    async buscarPorId(id) {
        const filmeData = await FilmeModel.findByPk(id, {
            include: [{ model: AvaliacaoModel, as: 'avaliacoes' }]
        });

        if (!filmeData) return null;

        return new Filme(
            filmeData.id,
            filmeData.titulo,
            filmeData.ano,
            filmeData.genero,
            filmeData.sinopse,
            filmeData.diretor,
            filmeData.nota,
            filmeData.avaliacoes || [],
            filmeData.notaPlataforma,
            filmeData.poster,
            filmeData.roteiristas
        );
    }

    async criar(filme) {
        const filmeCriado = await FilmeModel.create({
            titulo: filme.titulo,
            ano: filme.ano,
            genero: filme.genero,
            sinopse: filme.sinopse,
            diretor: filme.diretor,
            nota: filme.nota,
            notaPlataforma: filme.notaPlataforma,
            poster: filme.poster,
            roteiristas: filme.roteiristas,
            tmdb_id: filme.id
        });

        filme.id = filmeCriado.id;
        return filme;
    }

    async atualizar(filme) {
        const filmeExiste = await FilmeModel.findByPk(filme.id);
        if (!filmeExiste) {
            throw new Error("Impossível atualizar. O filme não foi encontrado no banco.");
        }

        await FilmeModel.update({
            titulo: filme.titulo,
            ano: filme.ano,
            genero: filme.genero,
            sinopse: filme.sinopse,
            diretor: filme.diretor,
            nota: filme.nota,
            notaPlataforma: filme.notaPlataforma,
            poster: filme.poster,
            roteiristas: filme.roteiristas
        }, {
            where: { id: filme.id }
        });

        return filme;
    }

    async listar({ pagina = 1, limite = 20, genero = '', ano = '', diretor = '', roteirista = '', titulo = '' }) {
        const offset = (pagina - 1) * limite;
        const where = {};

        if (genero) {
            where.genero = { [Op.like]: `%${genero}%` };
        }
        if (ano) {
            where.ano = ano;
        }
        if (diretor) {
            where.diretor = { [Op.like]: `%${diretor}%` };
        }
        if (roteirista) {
            where.roteiristas = { [Op.like]: `%${roteirista}%` };
        }
        if (titulo) {
            where.titulo = { [Op.iLike || Op.like]: `%${titulo}%` };
        }

        const { rows, count } = await FilmeModel.findAndCountAll({
            where,
            limit: parseInt(limite),
            offset: parseInt(offset),
            order: [['ano', 'DESC'], ['id', 'DESC']]
        });

        const filmesTratados = rows.map(filmeData => new Filme(
            filmeData.id,
            filmeData.titulo,
            filmeData.ano,
            filmeData.genero,
            filmeData.sinopse,
            filmeData.diretor,
            filmeData.nota,
            [],
            filmeData.notaPlataforma,
            filmeData.poster,
            filmeData.roteiristas
        ));

        return {
            paginaCorrente: parseInt(pagina),
            totalPaginas: Math.ceil(count / limite) || 1,
            totalFilmesApi: count,
            filmes: filmesTratados
        };
    }
}