import 'reflect-metadata'

import { container, DependencyContainer } from 'tsyringe'
import { clearContainer, getContainer, setContainer } from './../src/container'

describe('container', () => {
  afterEach(() => {
    clearContainer()
  })

  describe('#setContainer', () => {
    it('sets the container', () => {
      setContainer(container)

      expect(getContainer()).toEqual(container)
    })

    it('throws an error when the container is already set', () => {
      setContainer(container)

      expect(() => setContainer(container)).toThrowError('Dependency container already set')
    })
  })

  describe('#getContainer', () => {
    it('gets the container', () => {
      setContainer(container)

      expect(getContainer()).toEqual(container)
    })

    it('throws an error when the container is not set', () => {
      clearContainer()

      expect(() => getContainer()).toThrowError('No dependency container set')
    })
  })

  describe('#clearContainer', () => {
    it('clears the container', () => {
      const value = {}
      setContainer(value as DependencyContainer)
      clearContainer()
      expect(() => getContainer()).toThrowError('No dependency container set')
    })

    it('throws an error when the container is not set', () => {
      clearContainer()

      expect(() => getContainer()).toThrowError('No dependency container set')
    })
  })
})
