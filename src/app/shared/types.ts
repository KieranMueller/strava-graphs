export type Activity = {
    resource_state: number;
    athlete: Athlete;
    name: string;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    total_elevation_gain: number;
    type: string;
    sport_type: string;
    workout_type: number;
    id: number;
    start_date: string;
    start_date_local: string;
    timezone: string;
    utc_offset: number;
    location_city: string | null;
    location_state: string | null;
    location_country: string;
    achievement_count: number;
    kudos_count: number;
    comment_count: number;
    athlete_count: number;
    photo_count: number;
    map: Map;
    trainer: boolean;
    commute: boolean;
    manual: boolean;
    private: boolean;
    visibility: string;
    flagged: boolean;
    gear_id: string | null;
    start_latlng: [number, number];
    end_latlng: [number, number];
    average_speed: number;
    max_speed: number;
    has_heartrate: boolean;
    heartrate_opt_out: boolean;
    display_hide_heartrate_option: boolean;
    elev_high: number;
    elev_low: number;
    upload_id: number;
    upload_id_str: string;
    external_id: string;
    from_accepted_tag: boolean;
    pr_count: number;
    total_photo_count: number;
    has_kudoed: boolean;
}

export type Athlete = {
    badge_type_id: number;
    bio: any;
    city: string | null;
    country: string;
    created_at: string;
    firstname: string;
    follower: any;
    friend: any;
    id: number;
    lastname: string;
    premium: boolean;
    profile: string;
    profile_medium: string;
    resource_state: number;
    sex: string;
    state: string;
    summit: boolean;
    updated_at: string;
    username: string;
    weight: any
}

export type Map = {
    id: string;
    summary_polyline: string;
    resource_state: number;
}

export type TokenData = {
    accessToken: string;
    athlete: Athlete;
    expiresAt: number;
    expiresIn: number;
    refreshToken: string
    tokenType: string;
}