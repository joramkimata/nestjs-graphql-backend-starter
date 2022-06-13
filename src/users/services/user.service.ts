import { InjectRepository } from "@nestjs/typeorm";
import { HttpStatusCode } from "src/shared/enums/http-codes.enum";
import response from "src/shared/helpers/response.helper";
import { BaseService } from "src/shared/services/base.service";
import { Not, Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { UserType } from "../enums/user-type.enum";
import { CreateUserInput } from "../inputs/create-user.input";
import { ResponseUser } from "../responses/user.response";

import * as bcrypt from 'bcrypt'
import { hashing } from "src/shared/helpers/hashing.helper";
import { Role } from "../entities/role.entity";
import { Permission } from "../entities/permission.entity";
import { Logger } from "@nestjs/common";
import { UpdateUserInput } from "../inputs/update-user.input";
import { AssignRolesInput } from "../inputs/assign-roles.input";

export class UserService extends BaseService {

    private logger = new Logger(UserService.name);

    relations = ['department', 'user', 'site']

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>,
    ) {
        super();
    }

    getCurrentUserInfo(user: User) {
        return this.userRepository.findOne({
            where: {
                deleted: false,
                id: user.id
            },
            relations: ['roles', 'roles.permissions']
        });
    }

    async deleteUser(uuid: string) {
        const res = new ResponseUser();

        const existingUser = await this.userRepository.findOne({
            where: {
                deleted: false,
                uuid
            }
        });

        if (!existingUser) {
            return response(null, res, `User not found!`, HttpStatusCode.NO_FOUND);
        }

        existingUser.deleted = true;

        const saved = await this.userRepository.save(existingUser);


        return response(
            this.getEntityById(
                this.userRepository,
                saved.id,
                this.relations
            ),
            res
        );


    }

    getAllStaff() {
        return this.userRepository.find({
            where: {
                deleted: false,
                userType: UserType.STAFF
            },
            relations: this.relations
        });
    }

    getStaffDetail(uid: String) {
        return this.userRepository.find({
            where: {
                deleted: false,
                uuid: uid
            },
            relations: this.relations
        });
    }

    async updateUser(uuid: string, { email, fullName, phoneNumber }: UpdateUserInput) {
        const res = new ResponseUser();

        const existingUser = await this.userRepository.findOne({
            where: {
                deleted: false,
                uuid
            }
        });

        if (!existingUser) {
            return response(null, res, `User not found!`, HttpStatusCode.NO_FOUND);
        }

        const dbUser = await this.userRepository.findOne({
            where: {
                deleted: false,
                email,
                uuid: Not(uuid)
            }
        });

        if (dbUser) {
            return response(null, res, `User exists!`, HttpStatusCode.DUPLICATE);
        }


        existingUser.email = email;
        existingUser.fullName = fullName;
        existingUser.phoneNumber = phoneNumber;


        const saved = await this.userRepository.save(existingUser);

        return response(
            this.getEntityById(
                this.userRepository,
                saved.id,
                this.relations
            ),
            res
        );

    }

    async createUser({ email, password, confirmPassword, fullName, phoneNumber }: CreateUserInput) {
        const res = new ResponseUser();

        const dbUser = await this.userRepository.findOne({
            where: {
                deleted: false,
                email
            }
        });

        if (dbUser) {
            return response(null, res, `User exists!`, HttpStatusCode.DUPLICATE);
        }

        if (password !== confirmPassword) {
            return response(null, res, `Password mismatch`, HttpStatusCode.PASSWORD_MISMATCH);
        }



        const salt = await bcrypt.genSalt();

        const newUser = new User();
        newUser.email = email;
        newUser.fullName = fullName;
        newUser.phoneNumber = phoneNumber;

        newUser.password = await this.generatePassword(salt, password);

        const saved = await this.userRepository.save(newUser);

        return response(
            this.getEntityById(
                this.userRepository,
                saved.id,
                this.relations
            ),
            res
        );
    }

    async seedAdmin() {
        const dbUser = await this.userRepository.findOne({
            email: 'admin@graphql.org',
            deleted: false,
            active: true
        });

        let adminRole = await this.getAdminRoleWithLatestPermissions();

        if (!dbUser) {
            const user = new User();
            user.email = 'admin@graphql.org';
            user.active = true;
            user.fullName = 'Administrator';
            user.password = await hashing('admin.2022');
            user.roles = [adminRole];
            await this.userRepository.save(user);
            this.logger.debug('**** Administrator was created successfully');
        }
    }

    private async generatePassword(salt, password: string) {
        return bcrypt.hash(password, salt);
    }

    private async getAdminRoleWithLatestPermissions() {
        const dbRole = await this.roleRepository.findOne({
            name: 'ADMIN',
            deleted: false
        });

        const permissions = await this.permissionRepository.find({
            deleted: false
        });


        if (!dbRole) {
            const role = new Role();
            role.name = 'ADMIN';
            role.description = 'Administrator';
            role.displayName = 'Administrator';

            if (permissions.length) {
                role.permissions = permissions;
            }

            const adminRole = await this.roleRepository.save(role);

            return adminRole;
        } else {
            // delete all role permissions of admin
            await this.deleteRolePermissions(dbRole.id);

            if (permissions.length) {
                dbRole.permissions = permissions;
                this.logger.debug('**** Administrator Permissions was updated successfully');
            }

            const adminRole = await this.roleRepository.save(dbRole);

            return adminRole;
        }
    }

    private deleteRolePermissions(id: number) {
        return this.roleRepository.query(`delete from te_role_permissions where role_id=${id}`)
    }

    async assignRoles(assignRolesInput: AssignRolesInput) {
        const res = new ResponseUser();

        const { userUUID: uuid, roleUUIDs } = assignRolesInput;

        const user = await this.userRepository.findOne({
            where: {
                deleted: false,
                uuid
            }
        });

        if (!user) {
            return response(null, res, `User not found!`, HttpStatusCode.NO_FOUND);
        }

        let roles: Role[] = [];

        try {
            roles = await this.validateRoles(roleUUIDs);
        } catch (err) {
            return response(null, res, `${err.message}`, HttpStatusCode.THROWN_ERROR);
        }

        if (roles.length > 0) {
            // delete roles assigned user
            await this.deleteRoles(user.id);

            user.roles = roles;
        }


        const saved = await this.userRepository.save(user);

        return response(
            this.getEntityById(
                this.userRepository,
                saved.id,
                this.relations
            ),
            res
        );
    }

    private deleteRoles(id: number) {
        return this.userRepository.query(`delete from te_user_roles where user_id=${id}`);
    }

    private validateRoles(uuids: string[]): Role[] | PromiseLike<Role[]> {
        const promise: Promise<Role[]> = new Promise(async (resolve, reject) => {

            const roles = uuids.map(async uuid => {
                const role = await this.roleRepository.findOne({
                    where: {
                        deleted: false,
                        uuid
                    }
                });
                if (!role) {
                    reject(`Role ${uuid} not message`)
                }

                return role;
            });

            const mroles = await Promise.all(roles);

            resolve(mroles);

        });

        return promise;
    }


    async changeUserPassword(uuid: string, password: string, confirmPassword: string) {
        const res = new ResponseUser();

        const existingUser = await this.userRepository.findOne({
            where: {
                deleted: false,
                uuid
            }
        });

        if (!existingUser) {
            return response(null, res, `User not found!`, HttpStatusCode.NO_FOUND);
        }

        if (password !== confirmPassword) {
            return response(null, res, `Password mismatches`, HttpStatusCode.PASSWORD_MISMATCH);
        }

        existingUser.password = await hashing(password);

        const saved = await this.userRepository.save(existingUser);


        return response(
            this.getEntityById(
                this.userRepository,
                saved.id,
                this.relations
            ),
            res
        );
    }


    async blockUser(uuid: string) {
        const res = new ResponseUser();

        const existingUser = await this.userRepository.findOne({
            where: {
                deleted: false,
                uuid
            }
        });

        if (!existingUser) {
            return response(null, res, `User not found!`, HttpStatusCode.NO_FOUND);
        }

        existingUser.active = false;

        const saved = await this.userRepository.save(existingUser);


        return response(
            this.getEntityById(
                this.userRepository,
                saved.id,
                this.relations
            ),
            res
        );
    }


    async activateUser(uuid: string) {
        const res = new ResponseUser();

        const existingUser = await this.userRepository.findOne({
            where: {
                deleted: false,
                uuid
            }
        });

        if (!existingUser) {
            return response(null, res, `User not found!`, HttpStatusCode.NO_FOUND);
        }

        existingUser.active = true;

        const saved = await this.userRepository.save(existingUser);


        return response(
            this.getEntityById(
                this.userRepository,
                saved.id,
                this.relations
            ),
            res
        );
    }



}