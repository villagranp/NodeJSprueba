'use strict'

const express = require('express')
const bodyparser = require('body-parser')
const jwt = require('jwt-simple')
const moment = require('moment')
const { Pool, Client } = require('pg')

const app = express()
const port = process.env.PORT || 3000
const conn = {	  user: 'liztex',
				  host: '172.16.23.153',
				  database: 'dbliztex',
				  password: 'golosin',
				  port: 5432,
				  client_encoding : 'utf8',
			}

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())


app.get('/api/token',(req, res) =>{
		
	const payload = {
		sub: "91509",
		iat: moment().unix() ,
		exp: moment().add(1 , 'hour' ).unix() ,
	}

	console.log(`Conectado`)

  	res .status(200) 
		.send( {
				message: 'success',
				token: jwt.encode(payload, 'clavetoken')})
})


app.get('/api/product',(req, res) =>{
		let products = [];
		const pool = new Pool(conn)
			pool.query('SET CLIENT_ENCODING TO "SQL_ASCII"; SELECT lzty_variable, descrip, abr FROM lzty_variable LIMIT 10;', (err, resp) => {
			if (resp[1].rowCount < 1)
			{
				res .status(404) 
					.send( {message: 'Ha ocurrido algun error. verifique!',
							product: products })	
			}
			else
			{	
				for (var i = resp[1].rows.length - 1; i >= 0; i--) {
				  	products[i] = ({ id : resp[1].rows[i].lzty_variable, 
				  					desc: resp[1].rows[i].descrip, 
				  					abr : resp[1].rows[i].abr })
				  }
				pool.end()
			  	res .status(200) 
					.send( {message: 'success',
							product: products })
			}
		})	
})

app.get('/api/product/:productId',(req, res) =>{
	let products = [];
	const pool = new Pool(conn)
	if( isNaN(req.params.productId) ){
		res .status(400) 
			.send( {message: 'Ha ocurrido algun error con el parametro. verifique!',
					product: products })	
	}
	else{
		pool.query(`SET CLIENT_ENCODING TO "SQL_ASCII"; 
					SELECT * 
					FROM ininventario 
					WHERE lzty_articulo IN  (SELECT lzty_articulo 
												FROM lzty_articulo 
												WHERE abr = '${req.params.productId}')
					LIMIT 10;`, (err, resp) => {
			/*console.log(resp)
			console.log('-----------------------------------------------------------------------------------------')
			console.log(err)*/

			if (resp[1].rowCount < 1)
			{
				res .status(404) 
					.send( {message: 'Ha ocurrido algun error. verifique!',
							product: products })	
			}
			else
			{	
				for (var i = resp[1].rows.length - 1; i >= 0; i--) {
				  	products[i] = ({ lzty_articulo 	: resp[1].rows[i].lzty_articulo, 
				  					lzty_bodega		: resp[1].rows[i].lzty_bodega, 
				  					lzty_ubicacion 	: resp[1].rows[i].lzty_ubicacion,
				  					min 			: resp[1].rows[i].min,
				  					max 			: resp[1].rows[i].max,
				  					saldo			: resp[1].rows[i].saldo,
				  					fvencimiento	: resp[1].rows[i].fvencimiento,
				  					lzty_estado		: resp[1].rows[i].lzty_estado,
				  					acativos		: resp[1].rows[i].acativos,
				  					saldoi			: resp[1].rows[i].saldoi,
				  					transac			: resp[1].rows[i].transac,
				  					lzty_empresa	: resp[1].rows[i].lzty_empresa,
				  					lzty_concepto	: resp[1].rows[i].lzty_concepto
				  				})
				  }
				pool.end()
			  	res .status(200) 
					.send( {message: 'success',
							product: products })
			}
		})
	}
})

app.post('/api/product',(req, res) =>{
	let products = [];
	const pool = new Pool(conn)
	if( isNaN(req.body.padre) ){
		res .status(400) 
			.send( {message: 'Ha ocurrido algun error con el parametro. verifique!',
					product: products })	
	}
	else{
		pool.query(`SET CLIENT_ENCODING TO "SQL_ASCII"; SELECT prf_guardavariable( '${req.body.descrip}' , '${req.body.abr}' , ${req.body.padre} , ${req.body.usuario});`, (err, resp) => {
			if (resp[1].rowCount < 1)
			{
				res .status(404) 
					.send( {message: 'Ha ocurrido algun error. verifique!',
							product: products })	
			}
			else
			{	
				for (var i = resp[1].rows.length - 1; i >= 0; i--) {
				  	products[i] = ({ id : resp[1].rows[i].lzty_variable, 
				  					desc: resp[1].rows[i].descrip, 
				  					abr : resp[1].rows[i].abr })
				  }
				pool.end()
			  	res .status(200) 
					.send( {message: 'success',
							product: products })
			}
		})
	}
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
