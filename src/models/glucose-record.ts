class GlucoseRecord {
    id: number = 0;
    gl_per_dl: number;
    was_there_consumption: boolean;
    consumption: string | null;
    insulin_doses_used: number | null;
    user_id: number;
    created_at: null | string;
    updated_at: null | string;

    constructor(
        id: number = 0,
        gl_per_dl: number,
        was_there_consumption: boolean,
        consumption: string | null,
        insulin_doses_used: number | null,
        user_id: number,
        created_at: string | null = null,
        updated_at: string | null = null
    ) {
        this.id = id;
        this.gl_per_dl = gl_per_dl;
        this.was_there_consumption = was_there_consumption;
        this.consumption = consumption;
        this.insulin_doses_used = insulin_doses_used;
        this.user_id = user_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}

interface GlucoseRecordUpdateType {
    id?: number
    gl_per_dl?: number
    was_there_consumption?: boolean
    consumption?: string | null
    insulin_doses_used?: number | null
    user_id?: number
    created_at?: string
    updated_at?: string 
}
export { GlucoseRecord, GlucoseRecordUpdateType };