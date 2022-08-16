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

### Kitchen Sink Example
```ts
// pages/api/user/[id].ts
import { Controller, install, getBody, repository } from 'nextjs-backend-helpers'
import { NextApiRequest, NextApiResponse } from 'next'
import { UserRepository, UserNotFoundError } from './user-repository'

import {PrismaClient} from '@prisma/client'
import {BaseRepository as Base} from 'nextjs-backend-helpers'

// Tell nextjs-backend-helpers how to create your prisma client
// by implementing createClient in a abstract class such as this one
export abstract class BaseRepository<T, X> extends Base<T, X> {
  createClient() {
    return new PrismaClient()
  }
}

// use the repository decorator and extend the BaseRepository and ensure the
// constructor has zero arguments, as we put this into a simple dependency container
@repository()
export class UserRepository extends BaseRepository<Prisma.UserDelegate<User>, User> {
  getDataType(client: PrismaClient): Prisma.UserDelegate<any> {
    return client.user
  }

  async findByEmail(email: string) {
    // use this.single
    // returning a single record
    return await this.single(async (prisma) => {
      return await prisma.findUnique({
        where: {
          email
        }
      })
    })
  }

  async create(data: Omit<Prisma.UserCreateInput, 'id' | 'createdAt' | 'updatedAt'>) {
    return await this.single(async (prisma) => {
      const creationData = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      return await prisma.create({
        data: creationData
      })
    })
  }

  async update(data: UpdateUserArguments) {
    return await this.single(async (prisma) => {
      const updateData = {
        ...data,
        updatedAt: new Date()
      }

      return await prisma.update({
        where: {
          id: data.id
        },
        data: updateData
      })
    })
  }

  async delete(id: string) {
    return await this.single(async (prisma) => {
      return await prisma.delete({
        where: {
          id
        }
      })
    })
  }
}

// Extend the Controller class to get
// access to before, after and error handling middleware
export class UserController extends Controller {
  constructor() {
    super()

    this.before((req: NextApiRequest) => {
      console.log(Cookie.get('secret-cookie-value'))
    }).only('get')

    this.after(() => {
      console.log('im running after the post action has run')
    }).only('post')

    // This block catches all errors
    // that are an instance of Error
    this.rescue(Error, (error, request, response) => {
      response.status(500).json({
        errors: [error.message]
      })
    })

    // This block catches all errors
    // that are an instance of UserNotFoundError
    this.rescue(UserNotFoundError, (error, request, response) => {
      const { id } = getQuery<{id: string}>(request)
      response.status(404).json({
        errors: [`Unable to find user ${id}`]
      })
    })
  }

  // this action is triggered when the
  // /api/user/[id] route is sent a get request
  async get(_request: NextApiRequest, res: NextApiResponse) {
    const { id } = getQuery<{id: string}>(request)
    const user = await Repositorys.find(UserRepository).findById(id)

    return response.json({
      data: user
    })
  }
}

// Use `install(ControllerClass)` to hand your controller off to NextJS
export default install(UserController)
```
#### We also have test helpers

```ts
// don't import the default export, but the named export
import { UserController, UserRepository, RequestBuilder } from './user-controller.ts'
import { get, ReponseType, RequestBuilder } from 'nextjs-backend-helpers'

describe('UserController', () => {
  describe('returns a user', () => {
    let response: ResponseType
    let request: RequestBuilder
    let user: User

    beforeEach(async () => {
      // Controllers, and Repositorys all inherit from the
      // Facade class, allowing them to have methods mocked
      // and restored during testing, makking it simple to test.
      UserRepository.mock('findById', jest.fn(() => ({
        id: '123',
        name: 'Example user'
      })))
      request = RequestBuilder().query({
        id: '123'
      })
      response = await get(UserController, request)
    })

    afterEach(() => {
      UserRepository.reset('findById')
    })

    it("returns the requested user", () => {
      expect(response.json).toEqual({
        data: {
          id: '123',
          name: 'Example user'
        }
      })
    })
  })
})
```

