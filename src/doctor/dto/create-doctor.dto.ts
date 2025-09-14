import { IsNotEmpty, IsString } from "class-validator";

export class CreateDoctorDto {
    @IsString()
    @IsNotEmpty()
    readonly specialty!: string;
}
