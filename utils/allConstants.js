class DbConstants {
  constructor() {
    this.allAutos = [];
    this.subscriptionsList = [];
    this.driversList = [];
    this.sourcesList = [];
    this.destinationsList = [];
    this.harvestersList = [];
    this.cropsList = [];
  }

  async init() {
    await this.updateAll();
  }

  async updateAll() {
    const MongoClient = require('mongodb').MongoClient;
    const client = new MongoClient(process.env.DB_HOST, { useNewUrlParser: true });
    await client.connect();

    const allConstantsCursor = client.db('VAgro').collection('constants');
    const allConstants = await allConstantsCursor.find().toArray();

    const allAutosCursor = client.db('VAgro').collection('autos');
    this.allAutos = await allAutosCursor.find().toArray();

    // //////////////////////  watch for updates  ////////////////////////////////////

    const options = { fullDocument: 'updateLookup' };
    const constantsStream = allConstantsCursor.watch([], options);
    const autosStream = allAutosCursor.watch([], options);

    constantsStream.on('change', change => {
      this.assignOneValue(change.fullDocument);
    });

    autosStream.on('change', change => {
      this.allAutos = this.allAutos.map(auto => (String(auto._id) === String(change.fullDocument._id) ? change.fullDocument : auto));
    });

    this.assignValues(allConstants);
  }

  assignValues(allConstants) {
    for (const oneConstant of allConstants) {
      this[`${oneConstant.type}List`] = oneConstant.data;
    }
  }

  assignOneValue(constant) {
    if (Array.isArray(constant)) return this.assignValues(constant);

    this[`${constant.type}List`] = constant.data;
  }
}

const allConstants = new DbConstants();

module.exports = allConstants;
