import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'cm3p9k5u00000v8u4h1q2g3xt' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'John Doe', nullable: true })
  @Expose()
  name: string;

  @ApiProperty({ example: '2025-11-19T10:00:00.000Z' })
  @Expose()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
