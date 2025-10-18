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
    readonly status: 'PENDING' | 'CONFIRMED' | 'COMPLETE' | 'CANCEL';

    @IsString()
    readonly detail?: string;
}
