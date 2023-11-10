import prisma from '../database/client.js'
import Publisher from '../models/publisher.js'
import { ZodError } from 'zod'

const controller = {}     // Objeto vazio

controller.create = async function(req, res) {
  try {

    // Chama a validação do Zod
    Publisher.parse(req.body)

    await prisma.publisher.create({ data: req.body })

    // HTTP 201: Created
    res.status(201).end()
  }
  catch(error) {

    console.error(error)

    // Erro de validação do Zod
    // Retorna HTTP 422: Unprocessable Entity
    if(error instanceof ZodError) res.status(422).send(error.issues)
    
    // HTTP 500: Internal Server Error
    else res.status(500).send(error)
  }
}

controller.retrieveAll = async function(req, res) {
  try{

    // let include = {}  // Por padrão, não inclui nenhum relacionamento

    // // Somente vai incluir entidades relacionadas se
    // // a querystring "related" for passada na URL
    // if(req.query.related) include.cars = true

    const result = await prisma.publisher.findMany({
      orderBy: [
        { name_publisher: 'asc' }
      ]
    })

    // HTTP 200: OK
    res.send(result)
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
    res.status(500).send(error)
  }
}

controller.retrieveOne = async function(req, res) {
  try {
    const result = await prisma.publisher.findUnique({
      where: { id_publisher: Number(req.params.id_publisher) }
    })

    // Encontrou: retorna HTTP 200: OK
    if(result) res.send(result)
    // Não encontrou: retorna HTTP 404: Not found
    else res.status(404).end()
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
    res.status(500).send(error)
  }
}

controller.update = async function(req, res) {
  try {

    Publisher.parse(req.body)

    const result = await prisma.publisher.update({
      where: { id_publisher: Number(req.params.id_publisher) },
      data: req.body
    })

    // HTTP 204: No content
    if(result) res.status(204).end()
    // HTTP 404: Not found
    else res.status(404).end()
  }
  catch(error) {
    console.error(error)

    // Erro de validação do Zod
    // Retorna HTTP 422: Unprocessable Entity
    if(error instanceof ZodError) res.status(422).send(error.issues)
    
    // HTTP 500: Internal Server Error
    else res.status(500).send(error)
  }
}

controller.delete = async function(req, res) {
  try {
    const result = await prisma.publisher.delete({
      where: { id_publisher: Number(req.params.id_publisher) }
    })
    
    // HTTP 204: No Content
    if(result) res.status(204).end()
    // HTTP 404: Not Found
    else res.status(404).end()
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
    res.status(500).send(error)
  }
}

export default controller