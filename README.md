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

While this is fine for simple routes, it's easy to see how this doesn't scale.

## The Solution

`nextjs-backend-helpers` exports a number of use classes and functions to make not suck.

## Controllers

To create a class based controller, simply extend the `Controller` base class and `install` it.
`Controller`s support middleware through their `before` and `after` methods.

### Kitchen Sink Example
```ts
export class AppController extends Controller {
  constructor() {
    super()

    this.rescue(PrismaClientInitializationError, (error, request, response) => {
      Logger.error({
        message: 'Looks like we cant reach the database.'
        + 'Is the connection string right?'
        + 'Is the database up?',
      })

      response.status(500).json({
        errors: ['unable to reach database'],
      })
    })

    this.rescue(Error, (error, _request, response) => {
      response.status(500).json({
        errors: [error.constructor.name, error.message],
      })
    })

    // validate incoming post params against a ZOD type
    this.before(this.ensure({
      body: z.object({
        name: z.string(),
        age: z.string().optional()
      })
    })).only('post')
  }
}

type UserIdQuery = {
  id: string
}

type UserBody = {
  name: string,
  birthday: date
}

type GetResponse = {
  id: string,
  name: string
}

type PostResponse = {
  success: true
}

export class UserController extends AppController {
  constructor() {
    super()

    this.before((req: NextApiRequest) => {
      console.log(Cookie.get('secret-cookie-value'))
    }).only('get')

    this.after(() => {
      console.log('im running after the post action has run')
    }).only('post')
  }

  async get(request: NextApiRequest, response: NextApiResponse<GetResponse>) {
    //...
    const {id} = getQuery<UserIdQuery>(request)
    const {name, birthday} = getBody<UserBody>(request)
    const cookieValue = Cookie.get('secret-cookie-value')
    //..

    response.json({
      id,
      name,
      cookieValue
    })
  }

  async post(request: NextApiRequest, response: NextApiResponse<PostResponse>) {
    // request params have passed validation
    response.json({ success: true })
  }
}
```

#### We also have test helpers

```ts
// don't import the default export, but the named export
import { UserController, RequestBuilder } from './user-controller.ts'
import { get, ReponseType, RequestBuilder } from 'nextjs-backend-helpers'

describe('UserController', () => {
  describe('returns a user', () => {
    let response: ResponseType
    let request: RequestBuilder
    let user: User

    beforeEach(async () => {
      request = RequestBuilder().query({
        id: '123'
      })
      response = await get(UserController, request)
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

