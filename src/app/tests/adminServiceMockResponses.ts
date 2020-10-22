export const getUsersMock = [
    {
        id: 1,
        username: 'admin',
        roles: ['ROLE_USER', 'ROLE_ADMIN']
    },
    {
        id: 2,
        username: 'user',
        roles: ['ROLE_USER']
    }
];

export const updateUserMock = {
    success: true
};

export const deleteUserMock = {
    message: 'User removed',
    success: true
};

export const updateRegistrationMock = {
    allow: false,
    success: true
};

export const allowRegistrationMock = {
    allow: true
};

export const scrapeMock = {};

export const addSkillMock = {
    name: 'test',
    _links: {
        self: {
            href: 'http://localhost:8080/skills/23105cde-4148-4321-b312-3a1b9405a526'
        },
        skills: {
            href: 'http://localhost:8080/skills'
        }
    }
};
