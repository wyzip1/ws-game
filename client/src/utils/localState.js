class Local {
  state = { ...localStorage }

  constructor() {
    this.state = this.initParseData(this.state);
  }

  setState(any) {
    const isFn = typeof any === 'function'
    if(isFn) any(this.state)
    else this.state = any

    this.#setLocalStorage(this.state)
  }

  #setLocalStorage(data) {
    for (const key in data) {
      let value;
      try {
        value = JSON.stringify(data[key])
      } catch (err) {
        value = data[key]
      }
      localStorage.setItem(key, value)
    }
  }

  remove(key) {
    delete this.state[key]
    localStorage.removeItem('key')
  }

  clear() {
    this.state = {}
    localStorage.clear()
  }

  initParseData(data) {
    for (const key in data) {
      const value = data[key];
      try {
        data[key] = JSON.parse(value)
      } catch (err) {
        console.log('普通类型值', value);
      }
    }
    return data
  }
    
}

export default new Local()