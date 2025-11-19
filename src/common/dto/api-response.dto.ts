import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export class BaseApiResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates if the request was successful',
  })
  success: boolean;

  @ApiProperty({ example: 200, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({
    example: 'Operation completed successfully',
    description: 'Response message',
  })
  message: string;

  @ApiProperty({
    example: '2025-11-19T10:00:00.000Z',
    description: 'Response timestamp',
  })
  timestamp: string;
}

export function ApiResponseDto<T>(dataType: Type<T>) {
  class ResponseDto extends BaseApiResponseDto {
    @ApiProperty({ type: dataType })
    data: T;
  }
  return ResponseDto;
}

export function ApiResponseArrayDto<T>(dataType: Type<T>) {
  class ResponseDto extends BaseApiResponseDto {
    @ApiProperty({ type: [dataType] })
    data: T[];
  }
  return ResponseDto;
}
