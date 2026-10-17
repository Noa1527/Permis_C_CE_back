import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, QueryFilter } from 'mongoose';
import { CurrentUser } from "src/decorators/current-user.decorator";
import { Action } from "src/enums/action.enum";
import { ForbiddenReason } from "src/enums/forbidden_reason.enum";
import { Role } from "src/enums/role.enum";
import { ValidateMongoId } from "src/validators/mongo-object-id.validator";
import { CaslUserAbilityFactory } from "src/modules/users/casl/casl-user-ability.factory";
import { CreateUserDto } from "src/modules/users/dto/create-user.dto";
import { FindUserDto } from "src/modules/users/dto/find-user.dto";
import { UpdateUserDto } from "src/modules/users/dto/update-user.dto";
import { User, type UserDocument } from "src/modules/users/schemas/users.schema";
import { UsersService } from "src/modules/users/users.service";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { accessibleBy } from "@casl/mongoose";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    
    private readonly caslUserAbilityFactory: CaslUserAbilityFactory
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() dto: CreateUserDto,
    @CurrentUser() user: UserDocument
  ) {
    const ability = this.caslUserAbilityFactory.createForUser(user);
    const canCreateUser = ability.can(Action.Create, this.userModel);
    if (!canCreateUser) {
      throw new ForbiddenException(ForbiddenReason.ROLE);
    }

    return this.usersService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  findAll(
    @Query() dto: FindUserDto,
    @CurrentUser() user: UserDocument,
  ) {
    const ability = this.caslUserAbilityFactory.createForUser(user);
    const canReadOffers = ability.can(Action.Read, this.userModel);
    
    if (!canReadOffers) {
      throw new ForbiddenException(ForbiddenReason.ROLE);
    }

    // let query: QueryFilter<UserDocument> = {
    //   ...toMongoQuery(ability, this.userModel, Action.Read),
    // };

    const query: QueryFilter<UserDocument> = accessibleBy(
      ability,
      Action.Read,
    ).ofType(this.userModel);

  
    return this.usersService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get("own")
  findOwn(@CurrentUser() user: UserDocument) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(
    @Param("id", ValidateMongoId) id: string,
    @CurrentUser() user: UserDocument
  ) {
    const ability = this.caslUserAbilityFactory.createForUser(user);
    const userRead = await this.usersService.findOne(id);
    
    if (!userRead) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    const canReadUser = ability.can(Action.Read, userRead);
    
    if (!canReadUser) {
      throw new ForbiddenException(ForbiddenReason.ROLE);
    }
    
    if (!userRead) {
      throw new NotFoundException();
    }
    
    return userRead;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(
    @Param("id", ValidateMongoId) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: UserDocument
  ) {
    const ability = this.caslUserAbilityFactory.createForUser(user);
    const userToUpdate = await this.usersService.findOne(id);

    if (!userToUpdate) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    const canUpdateUser = ability.can(Action.Update, userToUpdate);
    
    if (!canUpdateUser) {
      throw new ForbiddenException(ForbiddenReason.ROLE);
    }
    
    // if (user.role !== Role.SuperAdmin && updateUserDto.role === Role.Admin) {
    //   throw new ForbiddenException(ForbiddenReason.ROLE);
    // }
    
    if (!userToUpdate) {
      throw new NotFoundException();
    }
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("")
  async updateOwn(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: UserDocument
  ) {
    const ability = this.caslUserAbilityFactory.createForUser(user);
    const userToUpdate = await this.usersService.findOne(String(user._id));

    if (!userToUpdate) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    const canUpdateUser = ability.can(Action.Update, userToUpdate);
    if (!canUpdateUser) {
      throw new ForbiddenException(ForbiddenReason.ROLE);
    }
    if (user.role !== Role.Admin && updateUserDto.role === Role.Admin) {
      throw new ForbiddenException(ForbiddenReason.ROLE);
    }
    if (!userToUpdate) {
      throw new NotFoundException();
    }
    return this.usersService.update(String(user._id), updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(
    @Param("id", ValidateMongoId) id: string,
    @CurrentUser() user: UserDocument
  ) {
    const ability = this.caslUserAbilityFactory.createForUser(user);
    const userToDelete = await this.usersService.findOne(id);

    if (!userToDelete) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    const canDeleteSite = ability.can(Action.Delete, userToDelete);
    if (!canDeleteSite) {
      throw new ForbiddenException(ForbiddenReason.ROLE);
    }
    if (!userToDelete) {
      throw new NotFoundException();
    }
    return this.usersService.remove(id);
  }

  
}