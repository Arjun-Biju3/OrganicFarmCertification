const { v4: uuidv4 } = require('uuid');
const {validationResult} = require('express-validator')

const HttError = require('../models/http-error')

const DUMMY_USERS = [
    {
        id: "u1",
        name: "Arjun",
        password:1116,
        email:"arjunbiju332@gmail.com",
        image: "https://imgcdn.stablediffusionweb.com/2024/3/15/936ea4ae-7b3d-4722-b5b7-9a29f5d15606.jpg",
        places: 2
    },
    {
        id: "u2",
        name: "Appu",
        password:1116,
        email:"appu76@gmail.com",
        image: "https://imgcdn.stablediffusionweb.com/2024/3/15/936ea4ae-7b3d-4722-b5b7-9a29f5d15606.jpg",
        places: 1
    },
    {
        id: "u3",
        name: "Priya",
        password:1116,
        email:"priya123@gmail.com",
        image: "https://imgcdn.stablediffusionweb.com/2024/3/15/936ea4ae-7b3d-4722-b5b7-9a29f5d15606.jpg",
        places: 1
    }
]

const getUsers = (req, res, next)=>{
    res.json({users:DUMMY_USERS});
};

const signup = (req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      console.log(errors);
      
      throw new HttError("Invalid inputs passed, please check your data",422)
    }
    const {name, email, password} = req.body;

    const hasUser = DUMMY_USERS.find(u=>u.email === email)

    if(hasUser){
        throw new HttError("could not create user .email already exist",422);
    }

    const createdUser = {
        id:uuidv4(),
        name,
        email,
        password
    }
    DUMMY_USERS.push(createdUser);
    res.status(201).json({createdUser});

}


const login = (req, res, next)=>{
 const {email,password} = req.body;
 const identifiedUser = DUMMY_USERS.find(u=>u.email === email);
 if(!identifiedUser || identifiedUser.password !== password){
    throw new HttError("could not identify user",401);
 }
 res.json({message:"logged in"})
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login =login;