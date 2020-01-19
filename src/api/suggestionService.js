import {
  tap,
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
  // console.log(responses)
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
  // console.log(results)
  return results

  // return [
  //   {name: 'Australia', cioc: 'AUS'},
  //   {name: 'China', cioc: 'CHI'},
  //   {name: 'New Zealand', cioc: 'NZL'},
  //   {name: 'United State of America', cioc: 'USA'},
  // ]
}

const transformCountryResponse = response => {
  // console.log(response)
  if (response) {
    return response.response
  }
  return null
  // return {
  //   name: 'Australia',
  //   icoc: 'AUS',
  // }
}

export const getSuggestions = subject => {
  return subject.pipe(
    // prettier-ignore
    debounceTime(500),
    distinctUntilChanged(),
    filter(val => val.length > 2),
    // map(getCountryByName),
    // switchMap(url => ajax(url)),
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
      // prettier-ignore
      // tap(_ => console.log(code)),
      map(transformCountryResponse),
      catchError(error => {
        console.error('error: ', error)
        return of(error)
      }),
    )
    return obs$
  }
}
