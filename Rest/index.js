'use strict'

const express = require('express')
const bodyparser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

app.get('/api/product',(req, res) =>{

	res.send( 200 , {products: [] })
})

app.get('/api/product/:productId',(req, res) =>{

	res.send(200 , {products: [] })	
})

app.post('/api/product',(req, res) =>{
	console.log(req.body)
	res .status(200)
		.send({ message: 'producto creado' })
})

app.get('/api/product/:productId',(req, res) =>{

	res.send({ status: 200 })
})

app.get('/api/product/:productId',(req, res) =>{

	res.send({ status: 200 })
})

app.listen(port,() => {
	console.log(`API REST en localhost:${port}`)
})
