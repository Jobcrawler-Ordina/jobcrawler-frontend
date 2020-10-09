import { User } from '../models/user.model';

export const loginMockResponse: User = {
    expiresIn: 1800,
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    token: `eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aW1vIiwiaWF0IjoxNjAyMTgwNjAzLCJleHAiOjE2MDIxODI0MDN9.
    9wcCOvmMVcfXfgqDsEvCnFUVlY4aF_bsef-0FPPr0du4A6PCNEc7xcOYt3CQ560U2Es9GeAriKB-otnQH3dSdQ`,
    tokenType: 'BEARER',
    username: 'admin'
};

export const signupMockResponse = {
    message: 'User registered successfully!',
    success: true
};
