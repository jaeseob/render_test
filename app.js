var express = require('express');
const querystring = require('querystring');  

var app = express();
app.use(express.json({
  limit: '10mb'
}))
app.use(express.urlencoded({
  limit: '10mb',
  extended: false
}))

app.use(express.static('public'));


// postgresql
const { Client } = require('pg');

// const client = new Client({
//     user : 'ljs',
//     host : 'localhost',
//     database : 'test',
//     password : '1234',
//     port : 5432,
// });

// heroku setting
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
});

client.connect();

const table_name = 'tbl1'

function create_table(){
  let query_msg = `CREATE TABLE IF NOT EXISTS ${table_name} (
    ID integer,
    task text,
    data text,
    UNIQUE(ID)
  )`
  
  client.query(query_msg,
    (err, result) => {
      if(result){
        console.log(`no error: ${table_name}`)
      }
      if(err){
        console.log('error creation')
      }
    })

}

create_table()



app.post('/server_checking', function(req, res){
  client.query(';', 
    (err, result) => {
      if(result){
        res.sendStatus(200)
      }

      if(err){
        res.sendStatus(400)
      }
    }
  )
})

// client.query("set server_encoding = 'UTF8';")
// client.query("set client_encoding = 'UTF8';")

app.get('/check_first', function(req, res){
  let id = req.query.id
  let query = `SELECT exists(select 1 from ${table_name} where id=${id});`

  // let query_str = require('url').URLSearchParams.stringify(req.query)
  let query_str = new URLSearchParams(req.query).toString();
  // let query_str = querystring.stringify(req.query)


  client.query(query, (err, result) =>{
    if(err){
      res.send("server connection failed")
    }else{
      let exist = result.rows[0].exists
      
      console.log(query)
      console.log(exist)
      
      if(exist){
        res.send('Already participated. Please contact experimenter.')
      }else{
        res.redirect('/exp.html?' + query_str)
      }
    }
  }
  )
  }
)


app.post('/send_data', function (req, res){
  const data = req.body;
  let query_msg = `UPDATE ${table_name} SET task = '${data.task}', data = '${JSON.stringify(data.data)}' WHERE ID = ${data.ID};`
  
  console.log(`${data.ID} send data`)
  console.log(query_msg)

  client.query(query_msg,
    (err, result) => {
      if(result){
        console.log('success')
      }
      if(err){
        console.log('error')
      }
    }
  )

  res.sendStatus(200)
})




app.post('/send_data2', function (req, res){
  const data = req.body;
  // let query_msg = `UPDATE ${table_name} SET task = '${data.task}', data = '${JSON.stringify(data.data)}' WHERE ID = ${data.ID};`

  let query_msg = `INSERT INTO ${table_name} (ID, task, data) VALUES (${data.ID} ,'${data.task}','${JSON.stringify(data.data)}') ON CONFLICT (ID) DO UPDATE SET task = EXCLUDED.task, data = EXCLUDED.data;`

  // let query_msg = `INSERT INTO ${table_name} (ID, task, data) VALUES (${data.ID} ,'${data.task}','${JSON.stringify(data.data)}') ON CONFLICT (ID) DO NOTHING;`
  // console.log(query_msg)
  
  // console.log(`${data.ID} send data`)
  // console.log(query_msg)

  client.query(query_msg,
    (err, result) => {
      if(result){
        console.log(`${data.ID} send success`)
      }
      if(err){
        console.log(`${data.ID} send error`)
      }
    }
  )

  res.sendStatus(200)
})



// download data
app.get('/download_data', async function (req, res){
  
  // let file_name = `${__dirname}/data/data_${Date.now()}.csv`
  let file_name = `data.csv`
  let query_msg = `\\COPY ${table_name} TO '${file_name}' DELIMITER ',' CSV HEADER;`

  // console.log(query_msg)
  res.send(`PGPASSWORD=eWS8gUgTo9MzPE2ngCRWlsxvz1WNGW9t psql -h dpg-cknvbmea02is73c4s130-a.oregon-postgres.render.com -U vnilab tbl<br>"${query_msg}"`)

  // await client.query(query_msg)
  // res.download(file_name)

})


// testing
app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});

