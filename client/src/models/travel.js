class Travel {

  constructor(travelId = null) {
    this.travelId = (travelId !== null) ? travelId.toString() : null
    this.startDate=new Date().toISOString().split('T')[0]
    this.endDate=null
    this.name=null
    this.description=null
    this.published=0
    this.imageUrl=null
  }

  isNew() {
    return this.travelId === null
  }
  hasImage() {
    return this.imageUrl !== null && this.imageUrl !== undefined
  }
  isPublished() {
    return this.published===1
  }

}

export {
  Travel
}
