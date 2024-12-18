import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core'
import { Activity, ActivityType, ActivityTypeObj, AllUnits, Athlete, AvailableUnitsObj, ClampedUnitsObj, CreateGraphArgs, CycleSports, GraphType, SelectedUnitsObj, UnitTypes } from '../../shared/types'
import { AthleteService } from '../../shared/athlete.service'
import { CommonModule, DatePipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import Chart from 'chart.js/auto'
import { mapValueAndUnitToDefaultValueAndUnit, METERS_SEC_TO_KMH, METERS_SEC_TO_METERS_SEC, METERS_SEC_TO_MPH, METERS_TO_FEET, METERS_TO_KILOMETERS, METERS_TO_METERS, METERS_TO_MILES, METERS_TO_YARDS, SECONDS_TO_HOURS, SECONDS_TO_MINUTES, SECONDS_TO_SECONDS } from '../../shared/units.util'
import { LOCAL_STORAGE_ACTIVITIES, LOCAL_STORAGE_ADV_SETTINGS, LOCAL_STORAGE_CLICK_POINT_REMOVE, LOCAL_STORAGE_IS_DEMO_MODE, LOCAL_STORAGE_SETTINGS_KEY, LOCAL_STORAGE_TOKEN_KEY } from '../../shared/env'
import chartTrendline from "chartjs-plugin-trendline"
import { BLUE, BLUE_LINE, GREEN, GREEN_LINE, GREY, GREY_LINE, ORANGE, ORANGE_LINE, PINK, PINK_LINE, PURPLE, PURPLE_LINE, YELLOW, YELLOW_LINE } from '../../shared/color.util'
import { mapGraphTypeToActivityObjField } from '../../shared/graph.util'
import { sampleActivities, sampleAthlete } from '../../shared/sample-data'
import { NavComponent } from '../nav/nav.component'
import { AdvancedSettingsModalComponent } from '../../components/advanced-settings-modal/advanced-settings-modal.component'
import { SettingsService } from '../../shared/settings.service'
import { DropdownMessageComponent } from '../../components/dropdown-message/dropdown-message.component'
Chart.register(chartTrendline)

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, FormsModule, NavComponent, AdvancedSettingsModalComponent, DropdownMessageComponent],
    providers: [DatePipe],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    athlete: Athlete | null = null
    masterActivites: Activity[] = []
    activities: Activity[] = []
    activityTypes: ActivityTypeObj = {
        cycleSports: ['Ride', 'Mountain Bike Ride', 'Gravel Ride', 'E-Bike Ride', 'E-Mountain Bike Ride', 'Velomobile', 'VirtualRide'],
        footSports: ['Run', 'Trail Run', 'Walk', 'Hike', 'Virtual Run'],
        waterSports: ['Canoe', 'Kayak', 'Kitesurf', 'Rowing', 'Stand Up Paddling', 'Surf', 'Swim', 'Windsurf'],
        winterSports: ['Ice Skate', 'Alpine Ski', 'Backcountry Ski', 'Nordic Ski', 'Snowboard', 'Snowshoe'],
        otherSports: ['Handcycle', 'Inline Skate', 'Rock Climb', 'Roller Ski', 'Golf', 'Skateboard', 'Football (Soccer)',
            'Wheelchair', 'Badminton', 'Tennis', 'Pickleball', 'Crossfit', 'Elliptical', 'Stair Stepper', 'Weight Training', 'Yoga',
            'Workout', 'HIIT', 'Pilates', 'Table Tennis', 'Squash', 'Racquetball']
    }
    selectedActivities: ActivityType[] = []
    availableGraphTypes: GraphType[] = ['avgSpeed', 'distance', 'movingTime', 'elapsedTime', 'maxSpeed', 'elevationGain']
    graphTypes: GraphType[] = ['avgSpeed']
    chart: any
    availableUnits: AvailableUnitsObj = {
        speed: ['mph', 'km/h', 'm/s'],
        distance: ['miles', 'kilometers', 'meters'],
        time: ['hours', 'minutes', 'seconds'],
        elevation: ['feet', 'yards', 'meters']
    }
    selectedUnits: SelectedUnitsObj = {
        speed: 'mph',
        watts: 'watts',
        distance: 'miles',
        time: 'minutes',
        elevation: 'feet'
    }
    clampedUnits: ClampedUnitsObj = {
        avgSpeed: {
            min: null,
            max: null
        },
        avgWatts: {
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
    isDemoMode = false
    scrollPosition = 0
    clickPointToRemove = false
    screenWidth = 0
    screenHeight = 0
    advancedSettings = {
        pointRadius: 5,
        trendlineWidth: 2,
        aspectRatio: 1.5
    }
    openAdvancedSettings = false
    showFilters = true
    isLoading = false
    errorStats = {
        connectionError: false,
        somethingWentWrong: false
    }

    constructor(private athleteService: AthleteService, private datePipe: DatePipe, private settingsService: SettingsService) { }

    ngOnInit() {
        this.screenWidth = window.innerWidth
        this.screenHeight = window.innerHeight
        const isDemoMode = JSON.parse(localStorage.getItem(LOCAL_STORAGE_IS_DEMO_MODE)!)
        if (isDemoMode) this.isDemoMode = true
        this.loadSettings()
        this.loadFromLocalStorage()
        this.getActivites()
    }

    @HostListener('window:scroll')
    onWindowScroll() {
        this.scrollPosition = document.documentElement.scrollTop || document.body.scrollTop
    }

    @HostListener('window:resize')
    handleScreenResize() {
        // calling on certain intervals instead of every change to reduce calls
        // --> don't want chooseGraph to fire every time mobile top bar collapses/expands
        let widthDiff = window.innerWidth - this.screenWidth
        let heightDiff = window.innerHeight - this.screenHeight
        if (Math.abs(widthDiff) > 20) {
            this.chooseGraph()
            this.screenWidth = window.innerWidth
        }
        if (Math.abs(heightDiff) > 150) {
            this.chooseGraph()
            this.screenHeight = window.innerHeight
        }
    }

    loadSettings() {
        const settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ADV_SETTINGS)!)
        if (settings) {
            this.settingsService.pointRadius.next(settings.pointRadius)
            this.settingsService.trendlineWidth.next(settings.trendlineWidth)
            this.settingsService.aspectRatio.next(settings.aspectRatio)
        }
        this.settingsService.pointRadius.subscribe({
            next: (value: number) => {
                this.advancedSettings.pointRadius = value
                if (this.chart)
                    this.chooseGraph()
            }
        })
        this.settingsService.trendlineWidth.subscribe({
            next: value => {
                this.advancedSettings.trendlineWidth = value
                if (this.chart)
                    this.chooseGraph()
            }
        })
        this.settingsService.aspectRatio.subscribe({
            next: value => {
                this.advancedSettings.aspectRatio = value
                if (this.chart)
                    this.chooseGraph()
            }
        })
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
        const clickPointToRemove = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CLICK_POINT_REMOVE)!)
        if (clickPointToRemove) this.clickPointToRemove = clickPointToRemove
    }

    getActivites() {
        if (this.isDemoMode) {
            this.athlete = sampleAthlete
            const dummyActivites = [...sampleActivities.reverse()]
            this.handleActivities(dummyActivites)
        } else {
            const activitiesFromLocal = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ACTIVITIES)!)
            if (!activitiesFromLocal) {
                this.athleteService.getAthleteActivities().subscribe({
                    next: (data: any) => {
                        this.isLoading = false
                        this.handleActivities(data)
                    }, error: (e: any) => {
                        this.handleError(e)
                    }
                })
            } else {
                this.handleActivities(activitiesFromLocal)
            }
        }
    }

    handleError(e: any) {
        this.isLoading = false
        if (e.status === 0) {
            this.errorStats.connectionError = true
            setTimeout(() => {
                this.errorStats.connectionError = false
            }, 3000)
        } else {
            this.errorStats.somethingWentWrong = true
            setTimeout(() => {
                this.errorStats.somethingWentWrong = false
            }, 3000)
        }
    }

    handleActivities(activities: any) {
        localStorage.setItem(LOCAL_STORAGE_ACTIVITIES, JSON.stringify(activities))
        this.activities = activities.reverse()
        this.masterActivites = this.activities
        if (this.selectedActivities.length > 0) {
            this.activities = this.activities.filter(activity =>
                this.selectedActivities.includes(activity.type as ActivityType) ||
                this.selectedActivities.includes(activity.sport_type as ActivityType))
        }
        this.addSportSpecificGraphOptions()
        this.chooseGraph()
    }

    addSportSpecificGraphOptions() {
        let count = 0
        this.selectedActivities.forEach(activity => {
            if (this.activityTypes.cycleSports.includes(activity as CycleSports)) count++
        })
        if (count > 0 || this.selectedActivities.length === 0) {
            if (!this.availableGraphTypes.includes('avgWatts'))
                this.availableGraphTypes.splice(1, 0, 'avgWatts')
        }
        else {
            if (this.availableGraphTypes.includes('avgWatts'))
                this.availableGraphTypes.splice(this.availableGraphTypes.indexOf('avgWatts'), 1)
            if (this.graphTypes.includes('avgWatts'))
                this.graphTypes.splice(this.graphTypes.indexOf('avgWatts'), 1)
        }
    }

    getGraphTypeLabel(graphType: GraphType): string {
        switch (graphType) {
            case 'avgSpeed': return 'Average Speed'
            case 'avgWatts': return 'Average Watts'
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

    handleScrollPosition() {
        window.scrollTo({
            top: this.scrollPosition,
        })
    }

    chooseGraph() {
        if (this.chart) this.chart.destroy()
        let args: CreateGraphArgs = {
            datasets: [],
        }
        for (let graphType of this.graphTypes) {
            switch (graphType) {
                case 'avgSpeed': {
                    const slope = this.calculateSlope(this.activities.map(activity => activity.start_date), this.activities.map(activity => activity.average_speed))
                    args.datasets.push({
                        label: `Average Speed (${this.selectedUnits.speed}) ${slope.toFixed(2)}`,
                        data: this.activities.map(activity => activity.average_speed * this.getUnitFactor('speed')),
                        borderColor: ORANGE_LINE,
                        backgroundColor: ORANGE,
                        pointRadius: this.advancedSettings.pointRadius,
                        trendlineLinear: { style: ORANGE, lineStyle: 'line', width: this.advancedSettings.trendlineWidth },
                    })
                    break
                }
                case 'avgWatts': {
                    const slope = this.calculateSlope(this.activities.map(activity => activity.start_date), this.activities.map(activity => activity.average_watts!))
                    args.datasets.push({
                        label: `Average Watts (W) ${slope.toFixed(2)}`,
                        data: this.activities.map(activity => activity.average_watts!),
                        borderColor: PURPLE_LINE,
                        backgroundColor: PURPLE,
                        pointRadius: this.advancedSettings.pointRadius,
                        trendlineLinear: { style: PURPLE, lineStyle: 'line', width: this.advancedSettings.trendlineWidth },
                    })
                    break
                }
                case 'maxSpeed': {
                    const slope = this.calculateSlope(this.activities.map(activity => activity.start_date), this.activities.map(activity => activity.max_speed))
                    args.datasets.push({
                        label: `Max Speed (${this.selectedUnits.speed}) ${slope.toFixed(2)}`,
                        data: this.activities.map(activity => activity.max_speed * this.getUnitFactor('speed')),
                        borderColor: PINK_LINE,
                        backgroundColor: PINK,
                        pointRadius: this.advancedSettings.pointRadius,
                        trendlineLinear: { style: PINK, lineStyle: 'line', width: this.advancedSettings.trendlineWidth }
                    })
                    break
                }
                case 'distance': {
                    const slope = this.calculateSlope(this.activities.map(activity => activity.start_date), this.activities.map(activity => activity.distance))
                    args.datasets.push({
                        label: `Distance (${this.selectedUnits.distance}) ${slope.toFixed(2)}`,
                        data: this.activities.map(activity => activity.distance * this.getUnitFactor('distance')),
                        borderColor: GREEN_LINE,
                        backgroundColor: GREEN,
                        pointRadius: this.advancedSettings.pointRadius,
                        trendlineLinear: { style: GREEN, lineStyle: 'line', width: this.advancedSettings.trendlineWidth }
                    })
                    break
                }
                case 'elapsedTime': {
                    const slope = this.calculateSlope(this.activities.map(activity => activity.start_date), this.activities.map(activity => activity.elapsed_time))
                    args.datasets.push({
                        label: `Elapsed Time (${this.selectedUnits.time}) ${slope.toFixed(2)}`,
                        data: this.activities.map(activity => activity.elapsed_time * this.getUnitFactor('time')),
                        borderColor: BLUE_LINE,
                        backgroundColor: BLUE,
                        pointRadius: this.advancedSettings.pointRadius,
                        trendlineLinear: { style: BLUE, lineStyle: 'line', width: this.advancedSettings.trendlineWidth }
                    })
                    break
                }
                case 'movingTime': {
                    const slope = this.calculateSlope(this.activities.map(activity => activity.start_date), this.activities.map(activity => activity.moving_time))
                    args.datasets.push({
                        label: `Moving Time (${this.selectedUnits.time}) ${slope.toFixed(2)}`,
                        data: this.activities.map(activity => activity.moving_time * this.getUnitFactor('time')),
                        borderColor: YELLOW_LINE,
                        backgroundColor: YELLOW,
                        pointRadius: this.advancedSettings.pointRadius,
                        trendlineLinear: { style: YELLOW, lineStyle: 'line', width: this.advancedSettings.trendlineWidth }
                    })
                    break
                }
                case 'elevationGain': {
                    const slope = this.calculateSlope(this.activities.map(activity => activity.start_date), this.activities.map(activity => activity.total_elevation_gain))
                    args.datasets.push({
                        label: `Elevation Gain (${this.selectedUnits.elevation}) ${slope.toFixed(2)}`,
                        data: this.activities.map(activity => activity.total_elevation_gain * this.getUnitFactor('elevation')),
                        borderColor: GREY_LINE,
                        backgroundColor: GREY,
                        pointRadius: this.advancedSettings.pointRadius,
                        trendlineLinear: { style: GREY, lineStyle: 'line', width: this.advancedSettings.trendlineWidth }
                    })
                    break
                }
            }
        }
        this.createChart(args)
    }

    calculateSlope(dates: any[], data: number[]): number {
        const badIndecies = []
        for (let i = 0; i < data.length; i++) {
            if (!data[i]) {
                badIndecies.push(i)
            }
        }
        badIndecies.forEach(i => {
            dates[i] = undefined
        })
        dates = dates.filter(dates => dates)
        data = data.filter(data => data)

        const n = dates.length
        if (n < 2) return 0 // Not enough data points to calculate a slope

        // Convert dates to timestamps, then normalize to days since the first date
        const startTime = new Date(dates[0]).getTime()
        const daysSinceStart = dates.map(date => (new Date(date).getTime() - startTime) / (1000 * 60 * 60 * 24))

        // Calculate sums
        const sumX = daysSinceStart.reduce((sum, x) => sum + x, 0)
        const sumY = data.reduce((sum, y) => sum + y, 0)
        const sumXY = daysSinceStart.reduce((sum, x, i) => sum + x * data[i], 0)
        const sumX2 = daysSinceStart.reduce((sum, x) => sum + x * x, 0)

        // Apply the formula for the slope
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
        // slope number is really small otherwise
        let amplifyFactor = 1
        if (Math.abs(slope) < 0.1) {
            amplifyFactor = 100
        }
        else if (Math.abs(slope) < 1) {
            amplifyFactor = 10
        } else if (Math.abs(slope) > 100) {
            amplifyFactor = 0.01
        } else if (Math.abs(slope) > 10) {
            amplifyFactor = 0.1
        }
        return slope * amplifyFactor
    }

    createChart(args: CreateGraphArgs) {
        this.chart = new Chart('MyChart', {
            type: 'line',
            data: {
                labels: this.activities.map(activity =>
                    this.datePipe.transform(activity.start_date, 'shortDate')),
                datasets: args.datasets
            },
            options: {
                onClick: (event) => this.handleChartClickPoint(event),
                aspectRatio: this.advancedSettings.aspectRatio,
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255)'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.dataset.label
                                const dataPoint: any = context.raw
                                const activity = this.activities[context.dataIndex]
                                return [activity.name, `${label?.substring(0, label.indexOf(')') + 1)}: ${dataPoint.toFixed(2)}`]
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: '#21211f',
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255)'
                        }
                    },
                    y: {
                        grid: {
                            color: '#21211f',
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255)'
                        }
                    },
                }
            },
        })
        this.handleScrollPosition()
    }

    handleChartClickPoint(event: any) {
        if (!this.clickPointToRemove) return
        const points = this.chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true)
        if (points.length) {
            const pointIndex = points[0].index
            const clickedDataPoint = this.chart.data.datasets[0].data[pointIndex]
            this.activities.splice(pointIndex, 1)
            this.chooseGraph()
        }
    }

    toggleActivities(event: any) {
        const checked = event.target.checked
        const sport = event.target.value

        if (checked) this.selectedActivities.push(sport)
        else this.selectedActivities.splice(this.selectedActivities.indexOf(sport), 1)
        this.activities = this.masterActivites
        this.filterActivities()
        this.clampActivities()
        this.persistSettingsInStorage()
        this.addSportSpecificGraphOptions()
        this.chooseGraph()
    }

    filterActivities() {
        this.activities = this.activities.filter(activity =>
            this.selectedActivities.includes(activity.type as ActivityType) ||
            this.selectedActivities.includes(activity.sport_type as ActivityType))
        if (this.selectedActivities.length === 0) this.activities = this.masterActivites
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

    handleUnitFilters(unit: any, unitType: UnitTypes) {
        this.selectedUnits[unitType] = unit
        this.updateClampInputs(unitType)
        this.clampActivities()
        this.persistSettingsInStorage()
        this.chooseGraph()
    }

    updateClampInputs(unitType: UnitTypes) {
        // Refactor? Condense?
        switch (unitType) {
            case 'speed': {
                const minInput = this.minInputs.find(el => el.nativeElement.id === 'avgSpeed-min')
                const maxInput = this.maxInputs.find(el => el.nativeElement.id === 'avgSpeed-max')
                if (minInput) minInput.nativeElement.value = (this.clampedUnits.avgSpeed.min! * this.getUnitFactor(unitType)).toFixed(2) || null
                if (maxInput) maxInput.nativeElement.value = (this.clampedUnits.avgSpeed.max! * this.getUnitFactor(unitType)).toFixed(2) || null

                const minInput2 = this.minInputs.find(el => el.nativeElement.id === 'maxSpeed-min')
                const maxInput2 = this.maxInputs.find(el => el.nativeElement.id === 'maxSpeed-max')
                if (minInput2) minInput2.nativeElement.value = (this.clampedUnits.maxSpeed.min! * this.getUnitFactor(unitType)).toFixed(2) || null
                if (maxInput2) maxInput2.nativeElement.value = (this.clampedUnits.maxSpeed.max! * this.getUnitFactor(unitType)).toFixed(2) || null
                break
            }
            case 'distance': {
                const minInput = this.minInputs.find(el => el.nativeElement.id === 'distance-min')
                const maxInput = this.maxInputs.find(el => el.nativeElement.id === 'distance-max')
                if (minInput) minInput.nativeElement.value = (this.clampedUnits.distance.min! * this.getUnitFactor(unitType)).toFixed(2) || null
                if (maxInput) maxInput.nativeElement.value = (this.clampedUnits.distance.max! * this.getUnitFactor(unitType)).toFixed(2) || null
                break
            }
            case 'time': {
                const minInput = this.minInputs.find(el => el.nativeElement.id === 'elapsedTime-min')
                const maxInput = this.maxInputs.find(el => el.nativeElement.id === 'elapsedTime-max')
                if (minInput) minInput.nativeElement.value = (this.clampedUnits.elapsedTime.min! * this.getUnitFactor(unitType)).toFixed(2) || null
                if (maxInput) maxInput.nativeElement.value = (this.clampedUnits.elapsedTime.max! * this.getUnitFactor(unitType)).toFixed(2) || null

                const minInput2 = this.minInputs.find(el => el.nativeElement.id === 'movingTime-min')
                const maxInput2 = this.maxInputs.find(el => el.nativeElement.id === 'movingTime-max')
                if (minInput2) minInput2.nativeElement.value = (this.clampedUnits.movingTime.min! * this.getUnitFactor(unitType)).toFixed(2) || null
                if (maxInput2) maxInput2.nativeElement.value = (this.clampedUnits.movingTime.max! * this.getUnitFactor(unitType)).toFixed(2) || null
                break
            }
            case 'elevation': {
                const minInput = this.minInputs.find(el => el.nativeElement.id === 'elevationGain-min')
                const maxInput = this.maxInputs.find(el => el.nativeElement.id === 'elevationGain-max')
                if (minInput) minInput.nativeElement.value = (this.clampedUnits.elevationGain.min! * this.getUnitFactor(unitType)).toFixed(2) || null
                if (maxInput) maxInput.nativeElement.value = (this.clampedUnits.elevationGain.max! * this.getUnitFactor(unitType)).toFixed(2) || null
                break
            }
        }
    }

    clampUnits(graphType: GraphType, type: 'min' | 'max' | null, event: any, unit: AllUnits, reset = false, minInput?: HTMLInputElement, maxInput?: HTMLInputElement) {
        if (!reset) {
            const value = event.target.value
            const defaultValue = mapValueAndUnitToDefaultValueAndUnit(value, unit)
            this.clampedUnits[graphType][type!] = defaultValue
        } else {
            this.clampedUnits[graphType].min = null
            this.clampedUnits[graphType].max = null
            if (minInput) minInput.value = ''
            if (maxInput) maxInput.value = ''
        }
        this.clampActivities()
        this.persistSettingsInStorage()
        this.chooseGraph()
    }

    clampActivities() {
        this.activities = this.masterActivites
        this.filterActivities()
        for (let key in this.clampedUnits) {
            const min = this.clampedUnits[key as GraphType].min
            const max = this.clampedUnits[key as GraphType].max
            const field = mapGraphTypeToActivityObjField(key as GraphType)
            this.activities = this.activities.filter(activity => {
                if (activity[field]) {
                    return (activity[field] as number >= (min ? min : (Number.MIN_SAFE_INTEGER)))
                        && (activity[field] as number <= (max ? max : Number.MAX_SAFE_INTEGER))
                }
                return []
            })
        }
    }

    getSelectedUnitFromGraphType(graphType: GraphType): AllUnits {
        switch (graphType) {
            case 'avgSpeed': case 'maxSpeed': return this.selectedUnits.speed
            case 'avgWatts': return this.selectedUnits.watts
            case 'distance': return this.selectedUnits.distance
            case 'elapsedTime': case 'movingTime': return this.selectedUnits.time
            case 'elevationGain': return this.selectedUnits.elevation
        }
    }

    getShortOrLongUnitFromGraphType(graphType: GraphType): string {
        const unit = this.getSelectedUnitFromGraphType(graphType)
        if (window.innerWidth > 900) return unit
        switch (unit) {
            case 'kilometers': return 'km'
            case 'meters': return 'm'
            case 'hours': return 'hr'
            case 'minutes': return 'min'
            case 'seconds': return 'sec'
            case 'feet': return 'ft'
            case 'yards': return 'yds'
            case 'watts': return 'W'
            default: return unit
        }
    }

    persistSettingsInStorage() {
        const settings = {
            units: this.selectedUnits,
            activities: this.selectedActivities,
            graphTypes: this.graphTypes,
        }
        localStorage.setItem('performanceGraphs-settings', JSON.stringify(settings))
    }

    getActivityCountByName(activityName: ActivityType): number {
        let count = 0
        this.masterActivites.forEach(activity => {
            if (activity.type === activityName) count++
        })
        return count
    }

    reloadPage() {
        location.reload()
    }

    closeAdvancedSettings() {
        this.openAdvancedSettings = false
    }

    toggleClickPointToRemove() {
        this.clickPointToRemove = !this.clickPointToRemove
        localStorage.setItem(LOCAL_STORAGE_CLICK_POINT_REMOVE, JSON.stringify(this.clickPointToRemove))
    }

    getFreshActivities() {
        this.isLoading = true
        localStorage.removeItem(LOCAL_STORAGE_ACTIVITIES)
        this.getActivites()
    }
}
