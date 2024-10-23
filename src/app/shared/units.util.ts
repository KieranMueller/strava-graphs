import { AllUnits } from './types'

export const METERS_SEC_TO_MPH = 2.237
export const METERS_SEC_TO_KMH = 3.6
export const METERS_SEC_TO_METERS_SEC = 1
export const METERS_TO_MILES = 0.000621371
export const METERS_TO_KILOMETERS = 0.001
export const METERS_TO_FEET = 3.281
export const METERS_TO_YARDS = 1.09361
export const METERS_TO_METERS = 1
export const SECONDS_TO_HOURS = 0.00027777777
export const SECONDS_TO_MINUTES = 0.01666666666
export const SECONDS_TO_SECONDS = 1
export const MPH_TO_METERS_SEC = 0.44702726866
export const KMH_TO_METERS_SEC = 0.277778
export const MILES_TO_METERS = 1609.344
export const KILOMETERS_TO_METERS = 1000
export const HOURS_TO_SECONDS = 3600
export const MINUTES_TO_SECONDS = 60
export const FEET_TO_METERS = 0.3048
export const YARDS_TO_METERS = 0.9144

export const mapDefaultValueAndUnitToOtherUnit = (value: number, desiredUnit: AllUnits): number => {
    switch (desiredUnit) {
        case 'mph': return value * METERS_SEC_TO_MPH
        case 'km/h': return METERS_SEC_TO_KMH
        case 'm/s': return METERS_SEC_TO_METERS_SEC
        case 'miles': return METERS_TO_MILES
        case 'kilometers': return METERS_TO_KILOMETERS
        case 'meters': return METERS_TO_METERS
        case 'hours': return SECONDS_TO_HOURS
        case 'minutes': return SECONDS_TO_MINUTES
        case 'seconds': return SECONDS_TO_SECONDS
        case 'feet': return METERS_TO_FEET
        case 'yards': return METERS_TO_YARDS
    }
}

export const mapValueAndUnitToDefaultValueAndUnit = (value: number, unit: AllUnits): number => {
    switch (unit) {
        case 'mph': return value * MPH_TO_METERS_SEC
        case 'km/h': return value * KMH_TO_METERS_SEC
        case 'm/s': return value
        case 'miles': return value * MILES_TO_METERS
        case 'kilometers': return value * KILOMETERS_TO_METERS
        case 'meters': return value
        case 'hours': return value * HOURS_TO_SECONDS
        case 'minutes': return value * MINUTES_TO_SECONDS
        case 'seconds': return value
        case 'feet': return value * FEET_TO_METERS
        case 'yards': return value * YARDS_TO_METERS
    }
}