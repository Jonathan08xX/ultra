export default class ResponseOK<T> {

  private code = '000'
  private data: T

  constructor(data: T) {
    this.data = data
  }

}