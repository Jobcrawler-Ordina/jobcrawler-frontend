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
