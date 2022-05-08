# nextjs-backend-helpers

A collection of helpers designed to make fullstack NextJS services easier to create.
There are helpers to register API style `actions`, a base level database `Repository` class designed to work with [`Prisma`](https://www.prisma.io/) and quality of life helpers to retrieve query parameters or request body values from `NextApiRequest`s

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

export class ExampleController extends Controller {
  constructor() {
    super()

    this.before((req: NextApiRequest) => {
      console.log(Cookie.get('secret-cookie-value'))
    }).only('get')

    this.after(() => {
      console.log('im running after the post action has run')
    }).only('post')
  }

  get(_request: NextApiRequest, res: NextApiResponse) {
    return res.json({ alive: true })
  }

  post(_request: NextApiRequest, res: NextApiResponse) {
    const { health } = getBody<{ health: true }>(req)

    return res.json({ alive: health })
  }
}

export default install(HealthController)
```

## Facades

`nextjs-backend-helpers` comes with a number of helpful facades such as `Logger`, `Cookie` and `Hash`. These are classes that export a number of userful static methods to handle domain specific logic, such as managing cookies or hashing values.

```ts
// pages/api/health
import { Controller, install, Cookie } from 'nextjs-backend-helpers'

import { NextApiRequest, NextApiResponse } from 'next'

export class HealthController extends Controller {
  get(_request: NextApiRequest, res: NextApiResponse) {
    Cookie.set('server-side-only', 123, { httpOnly: true })
    res.json({ alive: true })
  }
}

install(HealthController)
```
### A Note about Facades

However, much like [Laravel Facades](https://laravel.com/docs/9.x/facades), `nextjs-backend-helpers` serve as "static procies" to underlying classes registered in our service container. Implementing our facades in this way provides the benefit of terse, expressive syntax while maintaining more testability and flexability than traditional implementations of dependency injection or static methods.

It's worth noting that some care needs to be taken when using facades. The primary danger of facades is class "scope creep". Since facades are easy to use an do not require injection, it can be easy to let your classes grow and use many facades in a single class.

Using dependency injection, it's simple to see when a class is starting to "creep" beyond it's original implementation; this is visible from a classes constructor growing in size as the class gathers dependencies. But, with Facades, that signalling of "scope creep" is lost. So, when using facades, pay special attention to the size of your class.

### Making your own Facades

Facades are service container backed classes that must use the `facade` decorator. Here is a simple Logger facade.

```ts
import { facade } from 'nextjs-backend-helpers'

class LoggerImplementation extends Facade {
  log(message: string) {
    console.log(`${Date.now()}: `, message)
  }
}

export const Logger = Facade.create(LoggerImplementation)
```

This facade can then be used in other parts of your application, providing a static method like proxy and simple testability out of the box.

```ts
class PersonService extends Facade {
  setName() {
    //...
    Logger.log('set the persons name')
  }
}

// PersonService.spec.ts

beforeEach(() => {
  Logger.mock(
    'log',
    () => undefined,
    jest
  )
  service.setName('name')
})

it('logs that the persons name was set', () => {
  expect(Logger.log).toHaveBeenCalledWith('set the persons name')
})
```
