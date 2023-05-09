export interface DoctorScheduleModel{
    id: string;
    patientId: string;
    patientFirstName : string;
    patientLastName : string;
    date: Date;
    time: string;
    doctorImageUrl: string;
}
