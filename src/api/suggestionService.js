import {tap, map} from 'rxjs/operators'

const transformRes = () => {
  return [
    {name: 'Australia', code: 'AUS'},
    {name: 'China', code: 'CHI'},
    {name: 'New Zealand', code: 'NZL'},
    {name: 'United State of America', code: 'USA'},
  ]
}
export const getSuggestions = subject => {
  return subject.pipe(
    // prettier-ignore
    tap(val => console.log(`Before map: ${val}`)),
    map(transformRes),
  )
}
