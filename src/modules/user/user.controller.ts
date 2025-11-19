import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/response/user-response.dto';
import { UserListResponseDto } from './dto/response/user-list-response.dto';
import { UserSingleResponseDto } from './dto/response/user-single-response.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: UserListResponseDto,
  })
  async findAll() {
    const user = await this.userService.findAll();
    return {
      success: true,
      statusCode: 200,
      message: 'Users retrieved successfully',
      data: plainToInstance(UserResponseDto, user),
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserSingleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      statusCode: 200,
      message: 'User retrieved successfully',
      data: plainToInstance(UserResponseDto, user),
      timestamp: new Date().toISOString(),
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserSingleResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return {
      success: true,
      statusCode: 201,
      message: 'User created successfully',
      data: plainToInstance(UserResponseDto, user),
      timestamp: new Date().toISOString(),
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserSingleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      success: true,
      statusCode: 200,
      message: 'User updated successfully',
      data: plainToInstance(UserResponseDto, user),
      timestamp: new Date().toISOString(),
    };
  }
}
