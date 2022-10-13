import mongoose from 'mongoose'

beforeAll(async () => {
  await mongoose.connect(
    'mongodb+srv://test:asdf@zettelcluster.iktudug.mongodb.net?retryWrites=true&w=majority',
    { dbName: `jest-${process.env.JEST_WORKER_ID}` }
  )
})

afterAll(async () => {
  await mongoose.disconnect()
})

beforeEach(async () => {
  for await (const collection of mongoose.connection.db.listCollections()) {
    await mongoose.connection.dropCollection(collection.name)
  }
})
