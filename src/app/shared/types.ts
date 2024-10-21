export type CreateGraphArgs = {
    datasets: { label: string, data: number[], backgroundColor: string }[]
    options: { aspectRatio: number }
}

export type SelectedUnitsObj = {
    speed: SpeedUnits,
    distance: DistanceUnits,
    time: TimeUnits,
    elevation: ElevationUnits
}

export type AvailableUnitsObj = {
    speed: SpeedUnits[],
    distance: DistanceUnits[],
    time: TimeUnits[],
    elevation: ElevationUnits[]
}

export type UnitTypes = 'speed' | 'distance' | 'time' | 'elevation'

export type SpeedUnits = 'mph' | 'km/h' | 'm/s'

export type DistanceUnits = 'miles' | 'kilometers' | 'meters'

export type TimeUnits = 'hours' | 'minutes' | 'seconds'

export type ElevationUnits = 'feet' | 'yards' | 'meters'

export type GraphType = 'avgSpeed' | 'distance' | 'movingTime' | 'elapsedTime' | 'maxSpeed' | 'elevationGain'

export type CycleSports = 'Ride' | 'Mountain Bike Ride' | 'Gravel Ride' | 'E-Bike Ride' | 'E-Mountain Bike Ride' | 'Velomobile' | 'Virtual Ride'

export type FootSports = 'Run' | 'Trail Run' | 'Walk' | 'Hike' | 'Virtual Run'

export type WaterSports = 'Canoe' | 'Kayak' | 'Kitesurf' | 'Rowing' | 'Stand Up Paddling' | 'Surf' | 'Swim' | 'Windsurf'

export type WinterSports = 'Ice Skate' | 'Alpine Ski' | 'Backcountry Ski' | 'Nordic Ski' | 'Snowboard' | 'Snowshoe'

export type OtherSports = 'Handcycle' | 'Inline Skate' | 'Rock Climb' | 'Roller Ski' |
    'Golf' | 'Skateboard' | 'Football (Soccer)' | 'Wheelchair' | 'Badminton' | 'Tennis' | 'Pickleball' | 'Crossfit' | 'Elliptical' |
    'Stair Stepper' | 'Weight Training' | 'Yoga' | 'Workout' | 'HIIT' | 'Pilates' | 'Table Tennis' | 'Squash' | 'Racquetball'

export type ActivityType = CycleSports | FootSports | WaterSports | WinterSports | OtherSports

export type ActivityTypeObj = {
    cycleSports: CycleSports[],
    footSports: FootSports[],
    waterSports: WaterSports[],
    winterSports: WinterSports[],
    otherSports: OtherSports[]
}

export type Activity = {
    resource_state: number
    athlete: Athlete
    name: string
    distance: number
    moving_time: number
    elapsed_time: number
    total_elevation_gain: number
    type: string
    sport_type: string
    workout_type: number
    id: number
    start_date: string
    start_date_local: string
    timezone: string
    utc_offset: number
    location_city: string | null
    location_state: string | null
    location_country: string
    achievement_count: number
    kudos_count: number
    comment_count: number
    athlete_count: number
    photo_count: number
    map: Map
    trainer: boolean
    commute: boolean
    manual: boolean
    private: boolean
    visibility: string
    flagged: boolean
    gear_id: string | null
    start_latlng: [number, number]
    end_latlng: [number, number]
    average_speed: number
    max_speed: number
    has_heartrate: boolean
    heartrate_opt_out: boolean
    display_hide_heartrate_option: boolean
    elev_high: number
    elev_low: number
    upload_id: number
    upload_id_str: string
    external_id: string
    from_accepted_tag: boolean
    pr_count: number
    total_photo_count: number
    has_kudoed: boolean
}

export type Athlete = {
    badge_type_id: number
    bio: any
    city: string | null
    country: string
    created_at: string
    firstname: string
    follower: any
    friend: any
    id: number
    lastname: string
    premium: boolean
    profile: string
    profile_medium: string
    resource_state: number
    sex: string
    state: string
    summit: boolean
    updated_at: string
    username: string
    weight: any
}

export type Map = {
    id: string
    summary_polyline: string
    resource_state: number
}

export type TokenData = {
    accessToken: string
    athlete: Athlete
    expiresAt: number
    expiresIn: number
    refreshToken: string
    tokenType: string
}