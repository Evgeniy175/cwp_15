class Repository {
  constructor() {
    this.objects = [];
  }

  findAll() {
    return Promise.resolve(this.objects);
  }

  findById(id) {
    return Promise.resolve(this.objects.find(object => object.id == id));
  }

  findOne(params) {
    const where = params.where;
    const keys = Object.keys(where);
    const results = this.objects.find(object => keys.every(key => object[key] == where[key]));
    return Promise.resolve({ dataValues: results });
  }

  create(object) {
    this.objects.push(object);
    return Promise.resolve(object);
  }

  update(object) {
    const idx = this.objects.findIndex(object.id);

    if (idx !== -1) this.objects[idx] = object;
    
    return Promise.resolve();
  }

  destroy() {
    const idx = this.objects.findIndex(object.id);
    
    if (idx == -1) return Promise.resolve(0);

    this.objects.splice(idx, 1);
    Promise.resolve(1);
  }

  mockClear() {
    this.objects = [];
  }
}

module.exports = Repository;
