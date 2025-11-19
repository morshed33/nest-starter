import { ApiProperty } from '@nestjs/swagger';
import { BaseApiResponseDto } from '../../../../common/dto/api-response.dto';
import { UserResponseDto } from './user-response.dto';

export class UserListResponseDto extends BaseApiResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  data: UserResponseDto[];
}
