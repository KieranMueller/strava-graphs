import { Component, OnInit } from '@angular/core'
import { Activity, ActivityType, ActivityTypeObj, Athlete, AvailableUnitsObj, CreateGraphArgs, GraphType, UnitTypes } from '../../shared/types'
import { AthleteService } from '../../shared/athlete.service'
import { CommonModule, DatePipe } from '@angular/common'
import Chart from 'chart.js/auto'
import { METERS_SEC_TO_KMH, METERS_SEC_TO_METERS_SEC, METERS_SEC_TO_MPH, METERS_TO_FEET, METERS_TO_KILOMETERS, METERS_TO_METERS, METERS_TO_MILES, METERS_TO_YARDS, SECONDS_TO_HOURS, SECONDS_TO_MINUTES, SECONDS_TO_SECONDS } from '../../shared/units.util'
import { LOCAL_STORAGE_SETTINGS_KEY, LOCAL_STORAGE_TOKEN_KEY } from '../../shared/env'
import chartTrendline from "chartjs-plugin-trendline"


@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule],
    providers: [DatePipe],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    athlete: Athlete | null = null
    masterActivites: Activity[] = []
    activities: Activity[] = []
    activityTypes: ActivityTypeObj = {
        cycleSports: ['Ride', 'Mountain Bike Ride', 'Gravel Ride', 'E-Bike Ride', 'E-Mountain Bike Ride', 'Velomobile'],
        footSports: ['Run', 'Trail Run', 'Walk', 'Hike', 'Virtual Run'],
        waterSports: ['Canoe', 'Kayak', 'Kitesurf', 'Rowing', 'Stand Up Paddling', 'Surf', 'Swim', 'Windsurf'],
        winterSports: ['Ice Skate', 'Alpine Ski', 'Backcountry Ski', 'Nordic Ski', 'Snowboard', 'Snowshoe'],
        otherSports: ['Handcycle', 'Inline Skate', 'Rock Climb', 'Roller Ski', 'Golf', 'Skateboard', 'Football (Soccer)',
            'Wheelchair', 'Badminton', 'Tennis', 'Pickleball', 'Crossfit', 'Elliptical', 'Stair Stepper', 'Weight Training', 'Yoga',
            'Workout', 'HIIT', 'Pilates', 'Table Tennis', 'Squash', 'Racquetball']
    }
    selectedActivities: ActivityType[] = []
    availableGraphTypes: GraphType[] = ['avgSpeed', 'distance', 'movingTime', 'elapsedTime', 'maxSpeed', 'elevationGain']
    graphTypes: GraphType[] = []
    chart: any
    availableUnits: AvailableUnitsObj = {
        speed: ['mph', 'km/h', 'm/s'],
        distance: ['miles', 'kilometers', 'meters'],
        time: ['hours', 'minutes', 'seconds'],
        elevation: ['feet', 'yards', 'meters']
    }
    selectedUnits: any = {
        speed: 'mph',
        distance: 'miles',
        time: 'minutes',
        elevation: 'feet'
    }
    isViewingAllActivities = true

    constructor(private athleteService: AthleteService, private datePipe: DatePipe) { }

    ngOnInit() {
        this.loadFromLocalStorage()
        this.getActivites()
    }

    loadFromLocalStorage() {
        const tokenData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)!)
        if (tokenData) {
            this.athlete = tokenData.athlete
        }
        const settingsStr = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY)
        if (!settingsStr) return
        const settings = JSON.parse(settingsStr)
        console.log(settings)
        if (settings) {
            if (settings.units) {
                console.log(settings.units)
                this.selectedUnits = settings.units
            }
            if (settings.activities) {
                console.log(settings.activities)
                this.selectedActivities = settings.activities
            }
            if (settings.graphTypes) {
                console.log(settings.graphTypes)
                if (settings.graphTypes.length === 0)
                    this.graphTypes.push('avgSpeed')
                else this.graphTypes = settings.graphTypes
            }
        }
    }

    getActivites() {
        this.athleteService.getAthleteActivities().subscribe({
            next: (data: any) => {
                this.activities = data.reverse()
                this.masterActivites = this.activities
                if (this.selectedActivities.length > 0) {
                    this.activities = this.activities.filter(activity =>
                        this.selectedActivities.includes(activity.type as ActivityType) ||
                        this.selectedActivities.includes(activity.sport_type as ActivityType))
                }
                this.chooseGraph()
            }, error: (e: any) => {
                console.log(e)
            }
        })
    }

    getGraphTypeLabel(graphType: GraphType): string {
        switch (graphType) {
            case 'avgSpeed': return 'Average Speed'
            case 'distance': return 'Distance'
            case 'elapsedTime': return 'Elapsed Time'
            case 'movingTime': return 'Moving Time'
            case 'maxSpeed': return 'Max Speed'
            case 'elevationGain': return 'Elevation Gain'
        }
    }

    addOrRemoveGraphType(graphType: GraphType) {
        if (!this.graphTypes.includes(graphType)) this.graphTypes.push(graphType)
        else this.graphTypes.splice(this.graphTypes.indexOf(graphType), 1)
        this.persistSettingsInStorage()
        this.chooseGraph()
    }

    chooseGraph() {
        if (this.chart) this.chart.destroy()

        let args: CreateGraphArgs = {
            datasets: [],
            options: { aspectRatio: 2 }
        }

        for (let graphType of this.graphTypes) {
            switch (graphType) {
                case 'avgSpeed': {
                    args.datasets.push({
                        label: `Average Speed (${this.selectedUnits.speed})`,
                        data: this.activities.map(activity => activity.average_speed * this.getUnitFactor('speed')), backgroundColor: 'blue'
                    })
                    break
                }
                case 'maxSpeed': {
                    args.datasets.push({
                        label: `Max Speed (${this.selectedUnits.speed})`,
                        data: this.activities.map(activity => activity.max_speed * this.getUnitFactor('speed')), backgroundColor: 'red'
                    })
                    break
                }
                case 'distance': {
                    args.datasets.push({
                        label: `Distance (${this.selectedUnits.distance})`,
                        data: this.activities.map(activity => activity.distance * this.getUnitFactor('distance')), backgroundColor: 'green'
                    })
                    break
                }
                case 'elapsedTime': {
                    args.datasets.push({
                        label: `Elapsed Time (${this.selectedUnits.time})`,
                        data: this.activities.map(activity => activity.elapsed_time * this.getUnitFactor('time')), backgroundColor: 'orange'
                    })
                    break
                }
                case 'movingTime': {
                    args.datasets.push({
                        label: `Moving Time (${this.selectedUnits.time})`,
                        data: this.activities.map(activity => activity.moving_time * this.getUnitFactor('time')), backgroundColor: 'pink'
                    })
                    break
                }
                case 'elevationGain': {
                    args.datasets.push({
                        label: `Elevation Gain (${this.selectedUnits.elevation})`,
                        data: this.activities.map(activity => activity.total_elevation_gain * this.getUnitFactor('elevation')), backgroundColor: 'purple'
                    })
                    break
                }
            }
        }
        this.createChart(args)
    }

    createChart(args: {
        datasets: { label: string, data: number[], backgroundColor: string }[],
        options: { aspectRatio: number }
    }) {

        this.chart = new Chart('MyChart', {
            type: 'line',
            data: {
                labels: this.activities.map(activity =>
                    this.datePipe.transform(activity.start_date, 'shortDate')),
                datasets: args.datasets
            },
            options: args.options,
        })
    }

    toggleActivities(event: any) {
        const checked = event.target.checked
        const sport = event.target.value

        if (checked) this.selectedActivities.push(sport)
        else this.selectedActivities.splice(this.selectedActivities.indexOf(sport), 1)
        this.activities = this.masterActivites
        this.activities = this.activities.filter(activity =>
            this.selectedActivities.includes(activity.type as ActivityType) ||
            this.selectedActivities.includes(activity.sport_type as ActivityType))
        if (this.selectedActivities.length === 0) this.activities = this.masterActivites
        this.persistSettingsInStorage()
        this.chooseGraph()
    }

    getUnitFactor(unit: UnitTypes): number {
        if (unit === 'speed') {
            switch (this.selectedUnits.speed) {
                case 'mph': {
                    return METERS_SEC_TO_MPH
                }
                case 'km/h': return METERS_SEC_TO_KMH
                case 'm/s': return METERS_SEC_TO_METERS_SEC
                default: return METERS_SEC_TO_MPH
            }
        }
        if (unit === 'distance') {
            switch (this.selectedUnits.distance) {
                case 'miles': return METERS_TO_MILES
                case 'kilometers': return METERS_TO_KILOMETERS
                case 'meters': return METERS_TO_METERS
                default: return METERS_TO_MILES
            }
        }
        if (unit === 'time') {
            switch (this.selectedUnits.time) {
                case 'hours': return SECONDS_TO_HOURS
                case 'minutes': return SECONDS_TO_MINUTES
                case 'seconds': return SECONDS_TO_SECONDS
                default: return SECONDS_TO_MINUTES
            }
        }
        if (unit === 'elevation') {
            switch (this.selectedUnits.elevation) {
                case 'feet': return METERS_TO_FEET
                case 'yards': return METERS_TO_YARDS
                case 'meters': return METERS_TO_METERS
                default: return METERS_TO_FEET
            }
        }
        else return 1
    }

    handleUnitFilters(unit: any, typeOfUnit: UnitTypes) {
        this.selectedUnits[typeOfUnit] = unit
        this.persistSettingsInStorage()
        this.chooseGraph()
    }

    persistSettingsInStorage() {
        const settings = {
            units: this.selectedUnits,
            activities: this.selectedActivities,
            graphTypes: this.graphTypes
        }
        localStorage.setItem('performanceGraphs-settings', JSON.stringify(settings))
    }
}
