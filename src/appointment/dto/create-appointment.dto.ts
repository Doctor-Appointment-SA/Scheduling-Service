import { IsDateString, IsNotEmpty, IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
    @IsUUID()
    @IsOptional()
    readonly patient_id?: string;

    @IsUUID()
    @IsOptional()
    readonly doctor_id?: string;

    @IsDateString()
    readonly appoint_date: string;

    @IsString()
    @IsNotEmpty()
    readonly status: string;

    @IsString()
    readonly detail?: string;
}
