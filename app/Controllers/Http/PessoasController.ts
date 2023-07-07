import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Livro from 'App/Models/Livro'

import Pessoa from 'App/Models/Pessoa'

export default class PessoasController {

    // Método que cadastra uma determinada Pessoa com id, nome, data de nascimento, sexo, telefone e endereço
    public async store({ request, response }: HttpContextContract) {
        const body = request.body()
        const pessoa = await Pessoa.create(body)

        response.status(201)

        return {
            message: 'Pessoa cadastrada com sucesso!',
            data: pessoa,
        }
    }

    // TESTE!!!
    // Método que exibe todas as Pessoas cadastradas e os Livros emprestados a ela
    public async index() {
        const pessoa = await Pessoa.query().preload('livros')

        return {
            data: pessoa,
        }
    }

    // TESTE!!!
    // Método que busca um id e exibe a respectiva Pessoa relacionada ao id
    public async show({ params }: HttpContextContract) {
        const pessoa = await Pessoa.findOrFail(params.id)

        await pessoa.load('livros')

        return {
            data: pessoa,
        }
    }

    // Método que busca um id e deleta a respectiva Pessoa relacionada ao id
    public async destroy({ params }: HttpContextContract) {
        const pessoa = await Pessoa.findOrFail(params.id)

        await pessoa.delete()

        return {
            message: 'Pessoa removida com sucesso!',
            data: pessoa,
        }
    }

    // Método que busca um id e atualiza os dados da respectiva Pessoa relacionada ao id
    public async update({ params, request }: HttpContextContract) {
        const body = request.body()
        const pessoa = await Pessoa.findOrFail(params.id)

        pessoa.telefone = body.telefone
        pessoa.endereco = body.endereco

        await pessoa.save()

        return {
            message: 'Dados pessoais atualizados com sucesso!',
            data: pessoa,
        }
    }


    // TESTE!!!
    // Método para uma pessoa pegar um livro emprestado
    public async emprestarLivro({ params, response }: HttpContextContract) {
        const pessoa = await Pessoa.findOrFail(params.pessoaId)
        const livro = await Livro.findOrFail(params.livroId)

        if (livro.pessoaId) {
            return response.status(400).json({
                message: 'O livro já está emprestado.',
            })
        }

        livro.pessoaId = pessoa.id
        await livro.save()

        return {
            message: 'Livro emprestado com sucesso!',
            data: livro,
        }
    }

}
