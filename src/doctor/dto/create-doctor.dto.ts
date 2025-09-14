import { IsNotEmpty, IsString, IsOptional, MinLength } from 'class-validator';

export class CreateDoctorDto {
  @IsString() @IsNotEmpty() id_card!: string;
  @IsString() @IsOptional() name?: string;
  @IsString() @IsOptional() lastname?: string;
  @IsString() @IsOptional() phone?: string;
  @IsString() @MinLength(8) password!: string;

  @IsString()
  @IsNotEmpty()
  readonly specialty!: string;
}
