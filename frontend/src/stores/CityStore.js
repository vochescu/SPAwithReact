import axios from 'axios'
const SERVER = 'https://course-web-vochescu1.c9users.io'

class CityStore{
    constructor(ee){
        this.ee=ee
        this.content=[]
        this.selected = null
    }
    getAll(){
       axios(SERVER + '/cities/')
        .then((response)=>{
            this.content = response.data
            this.ee.emit('CITY_LOAD')
        })
        .catch((error)=> console.warn(error))
    }
    addOne(city){
         axios.post(SERVER + '/cities/',city)
        .then(()=> this.getAll())
        .catch((error)=> console.warn(error))
    }
    deleteOne(id){
    axios.delete(SERVER + '/cities/' + id)
      .then(() => this.getAll())
      .catch((error) => console.warn(error))
    }
    saveOne(id, city){
    axios.put(SERVER + '/cities/' + id, city)
      .then(() => this.getAll())
      .catch((error) => console.warn(error))
    }
    getOne(id){
    axios(SERVER + '/cities/' + id)
      .then((response) => {
        this.selected = response.data
        this.ee.emit('SINGLE_CITY_LOAD')
      })
      .catch((error) => console.warn(error))
  }
}

export default CityStore