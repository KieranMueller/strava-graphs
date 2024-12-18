import { GraphType, Activity } from './types'

export const mapGraphTypeToActivityObjField = (graphType: GraphType): keyof Activity => {
    switch (graphType) {
        case 'avgSpeed': return 'average_speed'
        case 'avgWatts': return 'average_watts'
        case 'distance': return 'distance'
        case 'movingTime': return 'moving_time'
        case 'elapsedTime': return 'elapsed_time'
        case 'maxSpeed': return 'max_speed'
        case 'elevationGain': return 'total_elevation_gain'
    }
}