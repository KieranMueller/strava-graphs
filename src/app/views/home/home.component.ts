import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core'
import { Activity, ActivityType, ActivityTypeObj, AllUnits, Athlete, AvailableUnitsObj, ClampedUnitsObj, CreateGraphArgs, GraphType, SelectedUnitsObj, SpeedUnits, UnitTypes } from '../../shared/types'
import { AthleteService } from '../../shared/athlete.service'
import { CommonModule, DatePipe } from '@angular/common'
import Chart from 'chart.js/auto'
import { FEET_TO_METERS, HOURS_TO_SECONDS, KILOMETERS_TO_METERS, KMH_TO_METERS_SEC, METERS_SEC_TO_KMH, METERS_SEC_TO_METERS_SEC, METERS_SEC_TO_MPH, METERS_TO_FEET, METERS_TO_KILOMETERS, METERS_TO_METERS, METERS_TO_MILES, METERS_TO_YARDS, MILES_TO_METERS, MINUTES_TO_SECONDS, MPH_TO_METERS_SEC, SECONDS_TO_HOURS, SECONDS_TO_MINUTES, SECONDS_TO_SECONDS, YARDS_TO_METERS } from '../../shared/units.util'
import { LOCAL_STORAGE_SETTINGS_KEY, LOCAL_STORAGE_TOKEN_KEY } from '../../shared/env'
import chartTrendline from "chartjs-plugin-trendline"
import { BLUE, GREEN, GREY, ORANGE, PINK, YELLOW } from '../../shared/color.util'
Chart.register(chartTrendline)

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
    selectedUnits: SelectedUnitsObj = {
        speed: 'mph',
        distance: 'miles',
        time: 'minutes',
        elevation: 'feet'
    }
    clampedUnits: ClampedUnitsObj = {
        avgSpeed: {
            min: null,
            max: null
        },
        distance: {
            min: null,
            max: null
        },
        movingTime: {
            min: null,
            max: null
        },
        elapsedTime: {
            min: null,
            max: null
        },
        maxSpeed: {
            min: null,
            max: null
        },
        elevationGain: {
            min: null,
            max: null
        }
    }
    isViewingAllActivities = true
    @ViewChildren('minInput') minInputs!: QueryList<ElementRef>
    @ViewChildren('maxInput') maxInputs!: QueryList<ElementRef>

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
        if (settings) {
            if (settings.units) {
                this.selectedUnits = settings.units
            }
            if (settings.activities) {
                this.selectedActivities = settings.activities
            }
            if (settings.graphTypes) {
                if (settings.graphTypes.length === 0)
                    this.graphTypes.push('avgSpeed')
                else this.graphTypes = settings.graphTypes
            }
        }
    }

    getActivites() {
        this.athleteService.getAthleteActivities().subscribe({
            next: (data: any) => {
                console.log(data)
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
                        data: this.activities.map(activity => activity.average_speed * this.getUnitFactor('speed')),
                        backgroundColor: BLUE, trendlineLinear: { style: BLUE, lineStyle: 'line', width: 2 }
                    })
                    break
                }
                case 'maxSpeed': {
                    args.datasets.push({
                        label: `Max Speed (${this.selectedUnits.speed})`,
                        data: this.activities.map(activity => activity.max_speed * this.getUnitFactor('speed')),
                        backgroundColor: PINK, trendlineLinear: { style: PINK, lineStyle: 'line', width: 2 }
                    })
                    break
                }
                case 'distance': {
                    args.datasets.push({
                        label: `Distance (${this.selectedUnits.distance})`,
                        data: this.activities.map(activity => activity.distance * this.getUnitFactor('distance')),
                        backgroundColor: GREEN, trendlineLinear: { style: GREEN, lineStyle: 'line', width: 2 }
                    })
                    break
                }
                case 'elapsedTime': {
                    args.datasets.push({
                        label: `Elapsed Time (${this.selectedUnits.time})`,
                        data: this.activities.map(activity => activity.elapsed_time * this.getUnitFactor('time')),
                        backgroundColor: ORANGE, trendlineLinear: { style: ORANGE, lineStyle: 'line', width: 2 }
                    })
                    break
                }
                case 'movingTime': {
                    args.datasets.push({
                        label: `Moving Time (${this.selectedUnits.time})`,
                        data: this.activities.map(activity => activity.moving_time * this.getUnitFactor('time')),
                        backgroundColor: YELLOW, trendlineLinear: { style: YELLOW, lineStyle: 'line', width: 2 }
                    })
                    break
                }
                case 'elevationGain': {
                    args.datasets.push({
                        label: `Elevation Gain (${this.selectedUnits.elevation})`,
                        data: this.activities.map(activity => activity.total_elevation_gain * this.getUnitFactor('elevation')),
                        backgroundColor: GREY, trendlineLinear: { style: GREY, lineStyle: 'line', width: 2 }
                    })
                    break
                }
            }
        }
        this.createChart(args)
    }

    createChart(args: CreateGraphArgs) {
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

    clampUnits(graphType: GraphType, type: 'min' | 'max' | null, event: any, unit: AllUnits, reset = false, minInput?: HTMLInputElement, maxInput?: HTMLInputElement) {
        if (!reset) {
            const value: number = this.mapValueAndUnitToDefaultValueAndUnit(event.target.value, unit)
            this.clampedUnits[graphType][type!] = value
        } else {
            this.clampedUnits[graphType].min = null
            this.clampedUnits[graphType].max = null
            if (minInput) minInput.value = ''
            if (maxInput) maxInput.value = ''
        }
        const min = this.clampedUnits[graphType].min
        const max = this.clampedUnits[graphType].max
        const field = this.mapGraphTypeToActivityObjField(graphType)
        this.activities = this.masterActivites.filter(activity => (activity[field] as number >= (min ? min : Number.MIN_VALUE)) && (activity[field] as number <= (max ? max : Number.MAX_VALUE)))
        this.chooseGraph()
    }

    mapValueAndUnitToDefaultValueAndUnit(value: number, unit: AllUnits): number {
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

    mapGraphTypeToActivityObjField(graphType: GraphType): keyof Activity {
        switch (graphType) {
            case 'avgSpeed': return 'average_speed'
            case 'distance': return 'distance'
            case 'movingTime': return 'moving_time'
            case 'elapsedTime': return 'elapsed_time'
            case 'maxSpeed': return 'max_speed'
            case 'elevationGain': return 'total_elevation_gain'
        }
    }

    getSelectedUnitFromGraphType(graphType: GraphType): AllUnits {
        switch (graphType) {
            case 'avgSpeed': case 'maxSpeed': return this.selectedUnits.speed
            case 'distance': return this.selectedUnits.distance
            case 'elapsedTime': case 'movingTime': return this.selectedUnits.time
            case 'elevationGain': return this.selectedUnits.elevation
        }
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
