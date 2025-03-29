import { format } from 'date-fns'

const now = format(new Date(), "dd MMMM yyyy")

console.log(now)