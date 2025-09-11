import { IsDateString, IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class CreateAppointmentDto {
    @IsUUID()
    readonly patient_id: string;

    @IsUUID()
    readonly doctor_id: string;

    @IsDateString()
    readonly appoint_date: string;

    @IsString()
    @IsNotEmpty()
    readonly status: string;
}
