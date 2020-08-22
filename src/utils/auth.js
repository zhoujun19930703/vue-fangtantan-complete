import store from './storage'

const TokenKey = 'Access-Token'

export function getToken() {
  return store.get(TokenKey)
}

export function setToken(token) {
  return store.set(TokenKey, token)
}

export function removeToken() {
  return store.remove(TokenKey)
}

export function clearStorage() {  //清除存储的storage
  return store.clear()
}
