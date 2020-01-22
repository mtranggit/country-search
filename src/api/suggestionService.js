import {
  map,
  filter,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  catchError,
} from 'rxjs/operators'
import {ajax} from 'rxjs/ajax'
import {forkJoin, of} from 'rxjs'

const API_URL = 'https://restcountries.eu/rest/v2'

const getCountryByNameUrl = name => `${API_URL}/name/${name}`
const getCountryByCodeUrl = code => `${API_URL}/alpha/${code}`

const transformResults = responses => {
  const results = []
  responses.filter(Boolean).map(response => {
    const res = response.response
    if (Array.isArray(res) && res.length) {
      return res.map(item => {
        if (results.findIndex(r => r.cioc === item.cioc) === -1) {
          return results.push(item)
        }
        return item
      })
    } else {
      if (results.findIndex(r => r.cioc === res.cioc) === -1) {
        return results.push({...res})
      }
      return response
    }
  })
  return results
}

const transformCountryResponse = response => {
  if (response) {
    const countryData = response.response
    if (countryData) {
      // extract country data for displaying in the dialog popup
      const {name, flag, latlng = [], area, currencies = []} = countryData
      let currencyName, currencyCode, currencySymbol
      if (!!currencies) {
        currencyName = currencies[0].name
        currencyCode = currencies[0].code
        currencySymbol = currencies[0].symbol
      }
      return {
        name,
        flag,
        latlng,
        area,
        currencyName,
        currencyCode,
        currencySymbol,
      }
    }
  }
  return null
}

export const getSuggestions = subject => {
  return subject.pipe(
    // prettier-ignore
    debounceTime(500),
    distinctUntilChanged(),
    filter(val => val.length > 2),
    switchMap(val =>
      forkJoin(
        ajax(getCountryByNameUrl(val)).pipe(
          map(res => res),
          catchError(err => of(null)),
        ),
        ajax(getCountryByCodeUrl(val)).pipe(
          map(res => res),
          catchError(err => of(null)),
        ),
      ),
    ),
    map(transformResults),
  )
}

export const getCountryByCode = code => {
  if (code) {
    const obs$ = ajax(getCountryByCodeUrl(code)).pipe(
      map(transformCountryResponse),
      catchError(error => {
        console.error('Error: ', error)
        return of('Sorry, country details not found')
      }),
    )
    return obs$
  }
}
