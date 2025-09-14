import { IsDateString, IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class CreateAppointmentDto {
    // ดึง patient_id มาจากระบบ /auth/whoami
    // @IsUUID()
    // readonly patient_id: string;

    @IsUUID()
    readonly doctor_id: string;

    @IsDateString()
    readonly appoint_date: string;

    @IsString()
    @IsNotEmpty()
    readonly status: string;
}
