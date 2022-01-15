# nextjs-backend-helpers

A collection of helpers designed to make fullstack NextJS services easier to create.
There are helpers to register API style `actions`, a base level database `Repository` class designed to work with [`Prisma`](https://www.prisma.io/) and quality of life helpers to retrieve query parameters or request body values from `NextApiRequest`s

## How do I register a `Action`?

Below is an example of a simple health check API endpoint. It `registers` it's actions and enables the `nextjs` `bodyParser` middleware.

```ts
import { register } from 'nextjs-backend-helpers'

export const config = {
  api: { bodyParser: true }
}

export default register({
  get: () => {
    return async () => (_req: NextApiRequest, res: NextApiResponse) {
      return res.status(200).json({ health: 'alive' })
    }
  }
})
```

### What should I do when an action has a dependency?

When an action has a dependency (such as a repository), it should inject it via a default parameter into it's outter wrapping function.
Here is an example of `GET /users/:id`

```ts
import { getPageFromQuery } from 'nextjs-backend-helpers'
import { NextApiRequest, NextApiResponse } from 'next'
import { UserRepository } from 'repositories/user-respository' // lets pretend you created this file

export function get (userRepository = new UserRepository()) { // this is where you should inject dependencies via default arguments
  return async function handler (req: NextApiRequest, res: NextApiResponse) {
    const users = await userRepository.all(getPageFromQuery(req))
    res.status(200).json(users)
  }
}
```