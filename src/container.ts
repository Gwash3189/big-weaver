import { DependencyContainer } from "tsyringe";

let container: DependencyContainer | null = null

export function setContainer(c: DependencyContainer) {
  if (container === null) {
    container = c
    return container
  } else {
    throw new Error('Dependency container already set')
  }
}

export function getContainer() {
  if (container === null) {
    throw new Error('No dependency container set')
  } else {
    return container
  }
}

export function clearContainer() {
  container?.clearInstances()
  container = null
}
