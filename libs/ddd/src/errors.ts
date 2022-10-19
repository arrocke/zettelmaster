export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource[0].toUpperCase()}${resource.slice(1)} not found.`)
  }
}