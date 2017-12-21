import $get from 'lodash/get'
import $set from 'lodash/set'
import $unset from 'lodash/unset'
const api = {}
const ls = window.localStorage
var settingName = 'global-settings'
var settings = null

api.load = (name) => {
  const s = ls.getItem(settingName = name) || '{}'
  settings = JSON.parse(s)
}

api.save = (name) => {
  if (!settings) {
    if (process.env.NODE_ENV === 'development') {
      console.error('settings is null or undefined!')
    }
    return
  }
  ls.setItem(name || settingName, JSON.stringify(settings))
}

api.get = (path, defVal = '', convertor = null) => {
  const v = $get(settings, path, defVal)
  return convertor ? convertor(v) : v
}

api.set = (path, val) => {
  $set(settings, path, val)
  api.save()
}

api.unset = path => {
  $unset(settings, path)
  api.save()
}

api.dump = () => {
  return settings
}

api.load(settingName)

export default api
