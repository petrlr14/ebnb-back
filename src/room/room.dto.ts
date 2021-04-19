import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateResourceDTO {
  @IsNumberString()
  @IsNotEmpty()
  room_id: number;
}
