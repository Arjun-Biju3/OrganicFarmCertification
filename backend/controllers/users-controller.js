const {validationResult} = require('express-validator')

const HttpError = require('../models/http-error')
const User = require('../models/user')



const getUsers = async (req, res, next)=>{
    let users;
    try{
        users = await User.find({},'-password');
    }
    catch(error){
        return next(new HttpError("Fetching users failed, please try again later",500));
    }
    res.json({users:users.map(user=>user.toObject({getters:true}))})
};

const signup =async (req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      console.log(errors);
      
       return next(new HttpError("Invalid inputs passed, please check your data",422))
    }
    const {name, email, password} = req.body;

    let existingUser;
    try{
        existingUser = await User.findOne({email:email})
    }
    catch(error){
        return next(new HttpError('Signing up failed, please try again later.',500));
    }
    if(existingUser){
        return next(new HttpError('User exists already, please login instead',422));
    }

    const createdUser = new User({
            name,
            email,
            image:"https://www.google.com/imgres?q=nature%20images&imgurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fthumbnails%2F049%2F855%2F296%2Fsmall_2x%2Fnature-background-high-resolution-wallpaper-for-a-serene-and-stunning-view-photo.jpg&imgrefurl=https%3A%2F%2Fwww.vecteezy.com%2Ffree-photos%2F4k-nature&docid=QPoY9d5rgesGjM&tbnid=2F16SnveSNiQEM&vet=12ahUKEwiktdy5ju6LAxX3nK8BHZarCWgQM3oECDQQAA..i&w=714&h=400&hcb=2&ved=2ahUKEwiktdy5ju6LAxX3nK8BHZarCWgQM3oECDQQAA",
            password,
            places:[]
    })
    
    try{
        await createdUser.save();
    }
    catch(error){
        return next(new HttpError('Signing up failed, please try again',500));
    }


    res.status(201).json({user:createdUser.toObject({getters:true})});

}

const login = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (error) {
        return next(new HttpError('Logging in failed, please try again later.', 500));
    }

    if (!existingUser || existingUser.password !== password) {
        return next(new HttpError("Invalid credentials, could not log you in", 401));
    }

    res.json({ message: "logged in" });
};


exports.getUsers = getUsers;
exports.signup = signup;
exports.login =login;