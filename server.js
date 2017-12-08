const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')

//#region Definirea modelului bazei de date

// definirea bazei de date 'db_itineraries'
const sequelize = new Sequelize('db_itineraries','root','', {
  dialect : 'mysql',
  define : {
    timestamp : false
  }
})

// definirea modelului tabelei 'cities'
const City = sequelize.define('city', {
  city : {
    type : Sequelize.STRING,
    allowNull : false,
    validate : {
      len : [3,20]
    },
    timestamp : false
  },
  longitude : {
    type : Sequelize.FLOAT,
    validate : {
      isFloat : true
    }
  },
  latitude : {
    type : Sequelize.FLOAT,
    validate : {
      isFloat : true
    }
  }
}, {
  // validarea existentei ambelor coordonate sau niciuna; este inutila definirea doar a uneia
   validate: {
      hasBothCoords() {
      if ((this.latitude === null) !== (this.longitude === null)) {
        throw new Error('Require both latitude and longitude or none')
      }
    }
   }
})

// definirea modelului tabelei 'atrtraction'
const Attraction = sequelize.define('attraction', {
  name : {
    type : Sequelize.STRING,
    allowNull : false,
    validate : {
      len : [3,20]
    }
  },
  description : {
    type : Sequelize.TEXT,
    allowNull : true
  },
  // timpul aproximativ petrecut la atractia turistica
    duration : {
    type : Sequelize.SMALLINT,
    validate : {
      isInt : true,
      // durata trebuie sa fie un numar pozitiv
      isPositive(value) {
        if (parseInt(value) < 0) {
          throw new Error('Only positive values are allowed')
        }
      }
    }
  },
 longitude : {
    type : Sequelize.FLOAT,
    validate : {
      isFloat : true
    }
  },
  latitude : {
    type : Sequelize.FLOAT,
    validate : {
      isFloat : true
    } 
  }
}, {
  hasBothCoords() {
      if ((this.latitude === null) !== (this.longitude === null)) {
        throw new Error('Require either both latitude and longitude or neither')
      }
    }
})

// definirea modelului tabelei 'itinerary'
const Itinerary = sequelize.define('itinerary',{
  name : {
    type : Sequelize.STRING,
    allowNull : false,
    validate : {
      len : [1,20]
    }
  }
})
//#endregion

//#region Definirea relatiilor dintre tabele

// definirea relatiei One-To-Many dintre tabela 'city' si tabela 'attraction',un oras poate avea mai multe atractii
City.hasMany(Attraction)
Attraction.belongsTo(City)
// definirea relatiei One-To-Many dintre tabela 'itinerary' si tabela 'attraction',un itinerariu poate avea mai multe atractii
Itinerary.hasMany(Attraction)
Attraction.belongsTo(Itinerary)
// definirea relatiei One-To-Many dintre tabela 'city' si tabela 'itinerary',un oras poate avea mai multe itinerarii
City.hasMany(Itinerary)
//#endregion

const app = express()
app.use(bodyParser.json())

// crearea tabelelor; force : true fiecare model va executa DROP TABLE IF EXISTS inainte de a executa crearea tabelei
app.get('/create',(req,res,next)=>{
    sequelize.sync({force:true}) // force : true fiecare model va executa DROP TABLE IF EXISTS inainte de a executa crearea tabelei
    .then(()=>res.status(201).send('created'))
    .catch((err)=>next(err))
})
//#region metode HTTP pentru resursa cities si legaturile cu aceasta
//#region /cities
app.get('/cities', (req,res,next)=>{
    City.findAll()
    .then((cities)=> res.status(200).json(cities))
    .catch((err)=>next(err))
})

app.post('/cities', (req,res,next)=>{
    City.create(req.body)
    .then(()=>res.status(201).send('created'))
    .catch((err)=>next(err))
})

app.get('/cities/:id', (req,res,next)=>{
    City.findById(req.params.id,{include : [{ all: true }]})
    .then((city)=>{
        if(city){
            res.status(200).json(city)
        }
        else{
            res.status(404).send('not found')
        }
    })
    .catch((err)=>next(err))
})

app.put('/cities/:id', (req,res,next)=>{
    City.findById(req.params.id)
    .then((city)=>{
        if(city){
        return city.update(req.body, {fields : ['city','longitude','latitude']})    
        }
        else{
            res.status(404).send('not found')
        }
    })
    .then(()=>{
        if(!res.headersSent){
            res.status(201).send('modified')
        }
    })
    .catch((err)=>next(err))
})
app.delete('/cities/:id', (req,res,next)=>{
     City.findById(req.params.id)
    .then((city)=>{
        if(city){
        return city.destroy(req.body, {fields : ['city','latitude','longitude']})    
        }
        else{
            res.status(404).send('not found')
        }
    })
    .then(()=>{
        if(!res.headersSent){
            res.status(201).send('removed')
        }
    })
    .catch((err)=>next(err))
})
//#endregion
//#region /cities/:cid/attractions
app.get('/cities/:cid/attractions', (req,res,next)=>{
    City.findById(req.params.cid)
    .then((city)=>{
        if(city){
            return city.getAttractions()
        }
        else{
            res.status(404).send('not found')
        }
    })
    .then((attractions)=> {
        if(!res.headersSent){
            res.status(200).json(attractions)
        }
    })
    .catch((err)=>next(err))
})

app.post('/cities/:cid/attractions', (req,res,next)=>{
    City.findById(req.params.cid)
    .then((city)=>{
        if(city){
            let attraction = req.body
            attraction.cityId=city.id
            return Attraction.create(attraction)
        }
        else{
            res.status(404).send('not found')
        }
    })
    .then((messages)=> {
        if(!res.headersSent){
            res.status(201).json('created')
        }
    })
    .catch((err)=>next(err))
})

app.get('/cities/:cid/attractions/:aid', (req,res,next)=>{
     Attraction.findById(req.params.aid)
    .then((attraction)=>{
        if(attraction){
            res.status(200).json(attraction)
        }
        else{
            res.status(404).send('not found')
        }
    })
    .catch((err)=>next(err))
})
app.put('/cities/:cid/attractions/:aid', (req,res,next)=>{
    // doar daca nu modific si orasul
     Attraction.findById(req.params.aid)
    .then((attraction)=>{
        if(attraction){
        return attraction.update(req.body, {fields : ['name','description','duration',
        'longitude','latitude','cityId','itineraryId']})    
        }
        else{
            res.status(404).send('not found')
        }
    })
    .then(()=>{
        // e posibil sa incercam sa scriem pe un stream inchis 
        if(!res.headersSent){
            res.status(201).send('modified')
        }
    })
    .catch((err)=>next(err))
})
app.delete('/cities/:cid/attractions/:aid', (req,res,next)=>{
    Attraction.findById(req.params.aid)
    .then((attraction)=>{
        if(attraction)
        return attraction.destroy(req.body, {fields : ['name','description','duration',
        'longitude','latitude']})
        else{
            res.status(404).send('not found')
        }
    })
    .then(()=>{
        if(!res.headersSent){
            res.status(201).send('removed')
        }
    })
    .catch((err)=>next(err))
})
//#endregion
//#region /cities/:cityId/itineraries
app.get('/cities/:cityId/itineraries', (req,res,next)=>{
    City.findById(req.params.cityId)
    .then((city)=>{
        if(city){
            return city.getItineraries()
        }
        else{
            res.status(404).send('not found')
        }
    })
    .then((itineraries)=> {
        if(!res.headersSent){
            res.status(200).json(itineraries)
        }
    })
    .catch((err)=>next(err))
})

app.post('/cities/:cityId/itineraries', (req,res,next)=>{
    City.findById(req.params.cityId)
    .then((city)=>{
        if(city){
            let itinerary = req.body
            itinerary.cityId=city.id
            return Itinerary.create(itinerary)
        }
        else{
            res.status(404).send('not found')
        }
    })
    .then((itinerary)=> {
        if(!res.headersSent){
            res.status(201).json('created')
        }
    })
    .catch((err)=>next(err))
})

app.get('/cities/:cityId/itineraries/:itineraryId', (req,res,next)=>{
     Itinerary.findById(req.params.itineraryId,{include : [{ all: true }]})
    .then((itinerary)=>{
        if(itinerary){
            res.status(200).json(itinerary)
        }
        else{
            res.status(404).send('not found')
        }
    })
    .catch((err)=>next(err))
})
app.put('/cities/:cityId/itineraries/:itineraryId', (req,res,next)=>{
    // doar daca nu modific si orasul
     Itinerary.findById(req.params.itineraryId)
    .then((itinerary)=>{
        if(itinerary){
        return itinerary.update(req.body, {fields : ['name']
        })    
        }
        else{
            res.status(404).send('not found')
        }
    })
    .then(()=>{
        if(!res.headersSent){
            res.status(201).send('modified')
        }
    })
    .catch((err)=>next(err))
})
app.delete('/cities/:cityId/itineraries/:itineraryId', (req,res,next)=>{
    Itinerary.findById(req.params.itineraryId, {
        where : {cityId : req.params.cityId }
    })
    .then((itinerary)=>{
        if(itinerary)
        return itinerary.destroy(req.body, {fields : ['name']
        })
        else{
            res.status(404).send('not found')
        }
    })
    .then(()=>{
        if(!res.headersSent){
            res.status(201).send('removed')
        }
    })
    .catch((err)=>next(err))
})
//#endregion
//#region /cities/:cityId/itineraries/:itineraryId/attractions
app.get('/cities/:cityId/itineraries/:itineraryId/attractions', (req,res,next)=>{
    Attraction.findAll({
        where: { itineraryId: req.params.itineraryId, cityId : req.params.cityId }
    }
)
    .then((attractions)=>{
        if(!res.headersSent){
            res.status(200).json(attractions)
        }
    })
    .catch((err)=>next(err))
})

app.post('/cities/:cityId/itineraries/:itineraryId/attractions', (req,res,next)=>{
    Itinerary.findById(req.params.itineraryId)
    .then((itinerary)=>{
        if(itinerary.cityId == req.params.cityId){
        // folosim == deoarece nu dorim sa testam si tipul de date; in acest caz este suficient de exemplu 5 == '5' true
            let attraction = req.body
            attraction.itineraryId=itinerary.id
            attraction.cityId=req.params.cityId
            return Attraction.create(attraction)
        }
        else{
            res.status(404).send('not found')
        }
    })
    .then((attraction)=> {
        if(!res.headersSent){
            res.status(201).json('created')
        }
    })
    .catch((err)=>next(err))
})
app.get('/cities/:cityId/itineraries/:itineraryId/attractions/:attractionId', (req,res,next)=>{
     Attraction.findById(req.params.attractionId)
     .then((attraction)=>{
         if(attraction.cityId == req.params.cityId && attraction.itineraryId == req.params.itineraryId){ 
             // folosim == deoarece nu dorim sa testam si tipul de date
              res.status(200).json(attraction)
         }
          else{
            res.status(404).send('not found')
        }
     })
    .catch((err)=>next(err))
})
app.put('/cities/:cityId/itineraries/:itineraryId/attractions/:attractionId', (req,res,next)=>{
     Attraction.findById(req.params.attractionId,{
          where: { itineraryId: req.params.itineraryId, cityId : req.params.cityId }
     })
    .then((attraction)=>{
        if(attraction){
        return attraction.update(req.body, {fields : ['name','description','duration',
        'longitude','latitude','cityId','itineraryId']})    
        }
        else{
            res.status(404).send('not found')
        }
    })
    .then(()=>{
        if(!res.headersSent){
            res.status(201).send('modified')
        }
    })
    .catch((err)=>next(err))
})
app.delete('/cities/:cityId/itineraries/:itineraryId/attractions/:attractionId', (req,res,next)=>{
    Attraction.findById(req.params.attractionId,{
         where: { itineraryId: req.params.itineraryId, cityId : req.params.cityId }
    })
    .then((attraction)=>{
        if(attraction)
        return attraction.destroy(req.body, {fields :  ['name','description','duration',
        'longitude','latitude','cityId','itineraryId']
        })
        else{
            res.status(404).send('not found')
        }
    })
    .then(()=>{
        if(!res.headersSent){
            res.status(201).send('removed')
        }
    })
    .catch((err)=>next(err))
})
//#endregion
//#endregion

//region metode HTTP pentru attractions
app.get('/attractions', (req,res,next)=>{
    Attraction.findAll()
    .then((attractions)=> res.status(200).json(attractions))
    .catch((err)=>next(err))
})

app.post('/attractions', (req,res,next)=>{
    Attraction.create(req.body)
    .then(()=>res.status(201).send('created'))
    .catch((err)=>next(err))
})

app.get('/attractions/:attractionId', (req,res,next)=>{
    Attraction.findById(req.params.attractionId)
    .then((attraction)=>{
        if(attraction){
            res.status(200).json(attraction)
        }
        else{
            res.status(404).send('not found')
        }
    })
    .catch((err)=>next(err))
})

app.put('/attractions/:attractionId', (req,res,next)=>{
    Attraction.findById(req.params.attractionId)
    .then((attraction)=>{
        if(attraction){
        return attraction.update(req.body, {fields : ['name','description','duration',
        'longitude','latitude','cityId','itineraryId']})    
        }
        else{
            res.status(404).send('not found')
        }
    })
    .then(()=>{
        if(!res.headersSent){
            res.status(201).send('modified')
        }
    })
    .catch((err)=>next(err))
})
app.delete('/attractions/:attractionId', (req,res,next)=>{
     Attraction.findById(req.params.attractionId)
    .then((attraction)=>{
        if(attraction){
        return attraction.destroy(req.body, {fields : ['name','description','duration',
        'longitude','latitude']})    
        }
        else{
            res.status(404).send('not found')
        }
    })
    .then(()=>{
        if(!res.headersSent){
            res.status(201).send('removed')
        }
    })
    .catch((err)=>next(err))
})
//#endregion

//region metode HTTP pentru itineraries
app.get('/itineraries', (req,res,next)=>{
    Itinerary.findAll()
    .then((itineraries)=> res.status(200).json(itineraries))
    .catch((err)=>next(err))
})

app.post('/itineraries', (req,res,next)=>{
    Itinerary.create(req.body)
    .then(()=>res.status(201).send('created'))
    .catch((err)=>next(err))
})

app.get('/itineraries/:itineraryId', (req,res,next)=>{
    Itinerary.findById(req.params.itineraryId,{include : [Attraction]})
    .then((itinerary)=>{
        if(itinerary){
            res.status(200).json(itinerary)
        }
        else{
            res.status(404).send('not found')
        }
    })
    .catch((err)=>next(err))
})

app.put('/itineraries/:itineraryId', (req,res,next)=>{
    Itinerary.findById(req.params.itineraryId)
    .then((city)=>{
        if(city){
        return city.update(req.body, {fields : ['name']})    
        }
        else{
            res.status(404).send('not found')
        }
    })
    .then(()=>{
        if(!res.headersSent){
            res.status(201).send('modified')
        }
    })
    .catch((err)=>next(err))
})
app.delete('/itineraries/:itineraryId', (req,res,next)=>{
     Itinerary.findById(req.params.itinerariesId)
    .then((itinerary)=>{
        if(itinerary){
        return itinerary.destroy(req.body, {fields : ['name']})    
        }
        else{
            res.status(404).send('not found')
        }
    })
    .then(()=>{
        if(!res.headersSent){
            res.status(201).send('removed')
        }
    })
    .catch((err)=>next(err))
})

app.get('/itineraries/:itineraryId/attractions', (req,res,next)=>{
    Itinerary.findById(req.params.itineraryId)
    .then((itinerary)=>{
        if(itinerary){
            return itinerary.getAttractions()
        }
        else{
            res.status(404).send('not found')
        }
    })
    .then((attractions)=> {
        if(!res.headersSent){
            res.status(200).json(attractions)
        }
    })
    .catch((err)=>next(err))
})

app.post('/itineraries/:itineraryId/attractions', (req,res,next)=>{
    Itinerary.findById(req.params.itineraryId)
    .then((itinerary)=>{
        if(itinerary){
            let attraction = req.body
            attraction.itineraryId=itinerary.id
            return Attraction.create(attraction)
        }
        else{
            res.status(404).send('not found')
        }
    })
    .then((attraction)=> {
        if(!res.headersSent){
            res.status(201).json('created')
        }
    })
    .catch((err)=>next(err))
})

app.get('/itineraries/:itineraryId/attractions/:attractionId', (req,res,next)=>{
     Attraction.findById(req.params.attractionId)
    .then((attraction)=>{
        if(attraction){
            res.status(200).json(attraction)
        }
        else{
            res.status(404).send('not found')
        }
    })
    .catch((err)=>next(err))
})
app.put('/itineraries/:itineraryId/attractions/:attractionId', (req,res,next)=>{
     Attraction.findById(req.params.attractionId)
    .then((attraction)=>{
        if(attraction){
        return attraction.update(req.body, {fields : ['name','description','duration',
        'longitude','latitude','cityId','itineraryId']})    
        }
        else{
            res.status(404).send('not found')
        }
    })
    .then(()=>{
        if(!res.headersSent){
            res.status(201).send('modified')
        }
    })
    .catch((err)=>next(err))
})
app.delete('/itineraries/:itineraryId/attractions/:attractionId', (req,res,next)=>{
    Attraction.findById(req.params.attractionId)
    .then((attraction)=>{
        if(attraction)
        return attraction.destroy(req.body, {fields : ['name','description','duration',
        'longitude','latitude']})
        else{
            res.status(404).send('not found')
        }
    })
    .then(()=>{
        if(!res.headersSent){
            res.status(201).send('removed')
        }
    })
    .catch((err)=>next(err))
})
//#endregion

app.use((err, req, res, next) => {
  console.warn(err)
  res.status(500).send('some error') 
})

app.listen(8080)

