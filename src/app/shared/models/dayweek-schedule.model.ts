import { DoctorScheduleModel } from "./doctor-schedule.model";

export interface DayWeekSchedule<T>{
    id: string;
    dayWeek: string;
    todaySchedule: T[]
}