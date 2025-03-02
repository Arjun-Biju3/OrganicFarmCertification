import React from 'react';
import UserList from '../components/UsersList';

function Users() {
    const USERS = [
        {
            id: "u1",
            name: "Arjun",
            image: "https://imgcdn.stablediffusionweb.com/2024/3/15/936ea4ae-7b3d-4722-b5b7-9a29f5d15606.jpg",
            places: 2
        }
    ];

    return <UserList items={USERS} />;
}

export default Users;
