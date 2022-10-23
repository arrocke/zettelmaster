import mongoose from 'mongoose'

beforeAll(async () => {
  await mongoose.connect(
    `mongodb://127.0.0.1:27017/jest-${process.env.JEST_WORKER_ID}`, {
  })
})

afterAll(async () => {
  await mongoose.disconnect()
})

beforeEach(async () => {
  for await (const collection of mongoose.connection.db.listCollections()) {
    await mongoose.connection.dropCollection(collection.name)
  }
})
