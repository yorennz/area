import { UpdatePasswordDto, UpdateUserDto } from './dto/update-user.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, UserDto } from '../users/dto/user.dto';
import { Access_TokenDto } from '../dto/auth.dto';
import { UserDatabaseService } from '../../database/users_database.service';
import { HashToolService } from '../../utils/hashtool.service';
import { AreaDatabaseService, SingleAreaDatabaseService } from '../../database/areas_database.service';
import { User } from '../../database/schemas/user.schema';
import { TriggerDatabase } from 'apps/area-trigger/src/database/trigger_database.service';

@Injectable()
export class UsersService {
  constructor(
    private userDatabase: UserDatabaseService,
    private areaDatabase: AreaDatabaseService,
    private triggerDatabase: TriggerDatabase,
    private singleAreaDatabase: SingleAreaDatabaseService,
    private hashService: HashToolService
  ) {
  }

  async updateUserPassword(user: User, newPassword: UpdatePasswordDto) {
    const passwordMatch = await this.hashService.checkHash(newPassword.password, user.password)
    if (!passwordMatch)
      throw new UnauthorizedException("Password don't match")
    const newHashedPassword = await this.hashService.hashBcrypt(newPassword.new_password)
    return await this.userDatabase.findAndUpdateUserByToken(user.token, { password: newHashedPassword })
  }

  async updateUser(token: string, updatedUser: UpdateUserDto) {
    const data = await this.userDatabase.findAndUpdateUserByToken(token, updatedUser)
    return data
  }

  async verifyCredentials(user: LoginDto): Promise<Access_TokenDto> {
    // Check
    const findedUser = await this.userDatabase.findUserByEmail(user.email)
    if (!findedUser)
      throw new UnauthorizedException('Invalid login credentials');
    const passwordMatch = await this.hashService.checkHash(user.password, findedUser.password)
    if (!passwordMatch)
      throw new UnauthorizedException('Invalid login credentials');

    // Refresh Token
    const [token, tokenHash] = await this.hashService.genToken(findedUser.email);
    await this.userDatabase.findAndUpdateUserToken(findedUser.email, tokenHash)

    const clientToken: Access_TokenDto = new Access_TokenDto(token)
    return clientToken
  }

  async createUser(user: UserDto): Promise<Access_TokenDto> {
    const newUser = new User(user);
    // Hash Password
    newUser.password = await this.hashService.hashBcrypt(newUser.password)
    //Gen token
    const [token, tokenHash] = await this.hashService.genToken(newUser.email);

    newUser.token = tokenHash
    await this.userDatabase.create(newUser);
    const clientToken: Access_TokenDto = new Access_TokenDto(token)
    return clientToken
  }

  async deleteUser(token: string) {
    const deletedUser = await this.userDatabase.findAndDeleteUser(token) // Delete user
    const deletedArea = await this.areaDatabase.findAndDeleteAreaById(deletedUser.area._id) // Delete Area
    const tete = await this.singleAreaDatabase.findAndDeleteByHostArea(deletedUser.area) // Delete SingleArea
    console.log(tete)
  }
}