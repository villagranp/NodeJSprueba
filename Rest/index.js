'use strict'

const express = require('express')
const bodyparser = require('body-parser')
const { Pool, Client } = require('pg')

const app = express()
const port = process.env.PORT || 3000
const conn = {	  user: 'liztex',
				  host: '172.16.23.153',
				  database: 'dbliztex1',
				  password: 'golosin',
				  port: 5432,
			}

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

app.get('/api/product',(req, res) =>{
		let products = [];
		const pool = new Pool(conn)
		pool.query('SELECT * FROM lzty_variable LIMIT 1;', (err, resp) => {
			console.log(resp)
		  	for (var i = resp.rows.length - 1; i >= 0; i--) {
			  	products[i] = ({ id : resp.rows[i].lzty_variable, desc: resp.rows[i].descrip, abr: resp.rows[i].abr })
			  }
			  pool.end()
		  	res .status(200) 
				.send( {product: products })
		})
		
		
})

app.get('/api/product/:productId',(req, res) =>{
	console.log('ok')
	res .status(200)
		.send( {products: [] })	
})

app.post('/api/product',(req, res) =>{
	console.log(req.body)
	res .status(200)
		.send({ message: 'producto creado' })
})




/*
app.put('/api/product/:productId',(req, res) =>{

	res .status(200)
		.send({ message: 'producto creado' })
})

app.get('/api/product/:productId',(req, res) =>{

	res .status(200)
		.send({ message: 'producto creado' })
})
*/

app.listen(port,() => {
	console.log(`API REST en localhost:${port}`)
})
