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

const getCountryByName = name => `${API_URL}/name/${name}`
const getCountryByCode = code => `${API_URL}/alpha/${code}`

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
      })
    } else {
      if (results.findIndex(r => r.cioc === res.cioc) === -1) {
        return results.push({...res})
      }
    }
  })
  // console.log(results)
  return results

  // return [
  //   {name: 'Australia', code: 'AUS'},
  //   {name: 'China', code: 'CHI'},
  //   {name: 'New Zealand', code: 'NZL'},
  //   {name: 'United State of America', code: 'USA'},
  // ]
}

export const getSuggestions = subject => {
  return subject.pipe(
    // prettier-ignore
    tap(val => console.log(`Before map: ${val}`)),
    debounceTime(500),
    distinctUntilChanged(),
    filter(val => val.length > 2),
    // map(getCountryByName),
    // switchMap(url => ajax(url)),
    switchMap(val =>
      forkJoin(
        ajax(getCountryByName(val)).pipe(
          map(res => res),
          catchError(err => of(null)),
        ),
        ajax(getCountryByCode(val)).pipe(
          map(res => res),
          catchError(err => of(null)),
        ),
      ),
    ),
    map(transformResults),
  )
}
