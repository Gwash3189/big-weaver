# nextjs-backend-helpers

A collection of helpers designed to make fullstack NextJS services easier to create. There are helpers to register API style `controllers`, a database `Repository` class designed to work with [`Prisma`](https://www.prisma.io/), and even testing tools.

## The Problem

The NextJS Documentation says "you can build your entire API with API Routes.", but writing API routes in NextJS sucks. Here is an example handler for a post request:

```js
export default function handler(req, res) {
  if (req.method === 'POST') {
    // Process a POST request
  } else {
    // Handle any other HTTP method
  }
}
```

While this is fine for simple routes, it's easy to see how this doesn's scale.

## The Solution

`nextjs-backend-helpers` exports a number of use classes and functions to make not suck.

## Controllers

To create a class based controller, simply extend the `Controller` base class and `install` it.
`Controller`s support middleware through their `before` and `after` methods.

```ts
// pages/api/health
import { Controller, install, getBody } from 'nextjs-backend-helpers'
import { NextApiRequest, NextApiResponse } from 'next'
import { UserRepository, UserNotFoundError } from './user-repository'

export class ExampleController extends Controller {
  constructor() {
    super()

    this.before((req: NextApiRequest) => {
      console.log(Cookie.get('secret-cookie-value'))
    }).only('get')

    this.after(() => {
      console.log('im running after the post action has run')
    }).only('post')

    this.rescue(Error, (error, request, response) => {
      response.status(500).json({
        errors: [error.message]
      })
    })

    this.rescue(UserNotFoundError, (error, request, response) => {
      const { id } = getQuery<{id: string}>(request)
      response.status(404).json({
        errors: [`Unable to find user ${id}`]
      })
    })
  }

  async get(_request: NextApiRequest, res: NextApiResponse) {
    const { id } = getQuery<{id: string}>(request)
    const user = await Repositorys.find(UserRepository).findById(id)

    return response.json({
      data: user
    })
  }
}

export default install(HealthController)
```
