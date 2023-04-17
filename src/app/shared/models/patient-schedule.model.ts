export interface PatientScheduleModel{
  id: string
  doctorId: string;
  doctorFirstName : string;
  doctorLastName : string;
  date: Date;
  time: string;
}
