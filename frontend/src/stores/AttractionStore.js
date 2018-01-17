import axios from 'axios'
const SERVER = 'https://course-web-vochescu1.c9users.io'
class AttractionStore{
    
    constructor(ee){
        this.ee=ee
        this.content=[]
    }
    getAll(cityId, itineraryId){
       axios(SERVER + '/cities/' + cityId + '/itineraries/' + itineraryId + '/attractions/')
        .then((response)=>{
            this.content = response.data
            this.ee.emit('ATTRACTION_LOAD')
        })
        .catch((error)=> console.warn(error))
    }
    addOne(cityId, itineraryId,attraction){
         axios.post(SERVER + '/cities/' + cityId + '/itineraries/' + itineraryId + '/attractions/',attraction)
        .then(()=> this.getAll(cityId,itineraryId))
        .catch((error)=> console.warn(error))
    }
    deleteOne(cityId,itineraryId,attractionId){
    axios.delete(SERVER + '/cities/' + cityId + '/itineraries/' + itineraryId + '/attractions/' + attractionId)
      .then(() => this.getAll(cityId,itineraryId))
      .catch((error) => console.warn(error))
  }
    saveOne(cityId,itineraryId, attractionId,attraction){
    axios.put(SERVER + '/cities/' + cityId + '/itineraries/' + itineraryId + '/attractions/' + attractionId,attraction)
      .then(() => this.getAll(cityId,itineraryId))
      .catch((error) => console.warn(error))
  }
}

export default AttractionStore