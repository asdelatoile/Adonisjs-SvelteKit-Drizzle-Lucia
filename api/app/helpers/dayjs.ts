import dayjs from 'dayjs'
import Utc from 'dayjs/plugin/utc.js'

dayjs.extend(Utc)

export const dayjsUtc = dayjs
