import axios from 'axios'
const SERVER = 'https://course-web-vochescu1.c9users.io'

class ItineraryStore{
    constructor(ee){
        this.ee=ee
        this.content=[]
    }
    getAll(cityId){
       axios(SERVER + '/cities/' + cityId + '/itineraries/')
        .then((response)=>{
            this.content = response.data
            this.ee.emit('ITINERARY_LOAD')
        })
        .catch((error)=> console.warn(error))
    }
    addOne(cityId,itinerary){
         axios.post(SERVER + '/cities/' + cityId + '/itineraries/',itinerary)
        .then(()=> this.getAll(cityId))
        .catch((error)=> console.warn(error))
    }
    deleteOne(cityId,itineraryId){
    axios.delete(SERVER + '/cities/' + cityId + '/itineraries/' + itineraryId)
      .then(() => this.getAll(cityId))
      .catch((error) => console.warn(error))
  }
    saveOne(cityId, itineraryId, itinerary){
    axios.put(SERVER + '/cities/' + cityId + '/itineraries/' + itineraryId, itinerary)
      .then(() => this.getAll(cityId))
      .catch((error) => console.warn(error))
  }
  getOne(cityId,itineraryId){
    axios(SERVER + '/cities/' + cityId + '/itineraries/' + itineraryId)
      .then((response) => {
        this.selected = response.data
        this.ee.emit('SINGLE_ITINERARY_LOAD')
      })
      .catch((error) => console.warn(error))
  }
}

export default ItineraryStore