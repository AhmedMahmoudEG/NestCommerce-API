import { SetMetadata } from '@nestjs/common';
import { UserType } from '../../utlis/enums';

//roles method decorator
export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles);
