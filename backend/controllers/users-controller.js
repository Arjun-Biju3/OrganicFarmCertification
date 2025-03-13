const {validationResult} = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error')
const User = require('../models/user')
const Application = require('../models/application'); 




const getApplications = async (req, res, next) => {
    const creatorId = req.userData.userId; 
    let applications;
    try {
        applications = await Application.find({ creator: creatorId }); 
    } catch (error) {
        return next(new HttpError("Fetching applications failed, please try again later.", 500));
    }

    if (!applications || applications.length === 0) {
        return next(new HttpError("No applications found for this user.", 404));
    }

    res.json({ applications: applications.map(app => app.toObject({ getters: true })) });
};


const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid inputs passed, please check your data", 422));
    }

    const { name, email, password} = req.body;
    console.log(password,name,email);
    
    // Check if user already exists
    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (error) {
        return next(new HttpError('Signing up failed, please try again later.', 500));
    }

    if (existingUser) {
        return next(new HttpError('User already exists, please login instead.', 422));
    }

    // Hash password before saving
    let hashedPassword;

    try {
        hashedPassword = await bcrypt.hash(password, 12);
        console.log(hashedPassword);
        
    } catch (err) {
        console.log(err);
        
        return next(new HttpError('Could not create user, please try again.', 500));
    }

    // Create new user with hashed password
    const createdUser = new User({
        name,
        email,
        password: hashedPassword, 
        role: "user" 
    });

    try {
        await createdUser.save();
    } catch (error) {
        return next(new HttpError('Signing up failed, please try again.', 500));
    }

    // Generate JWT token
    let token;
    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email, role: createdUser.role },
            'supersecret_dont_share',
            { expiresIn: '1h' }
        );
    } catch (error) {
        return next(new HttpError('Signing up failed, please try again.', 500));
    }

   
    res.status(201).json({
        userId: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
        token: token
    });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (error) {
        return next(new HttpError('Logging in failed, please try again later.', 500));
    }

    let isValidPassword = false;
    try{
        isValidPassword = await bcrypt.compare(password,existingUser.password);
    }
    catch(error){
        return next(new HttpError('Could not log you in, Please check your credentials and try again.',500))
    }

    if(!isValidPassword){
        return next(new HttpError("Invalid credentials, could not log you in", 401));
    }

    if (!existingUser) {
        return next(new HttpError("Invalid credentials, could not log you in", 401));
    }

    let token;
    try{
        token = jwt.sign({userId:existingUser.id,email:existingUser.email},
            'supersecret_dont_share',
            {expiresIn:'1h'});
        }
        catch(error){
            return next(new HttpError('Logging in failed, please try again',500));
        }
   
    res.json({ userId:existingUser.id,email: existingUser.email, token: token ,role:existingUser.role});
};




const createApplication = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid inputs passed, please check your data", 422));
    }

    const {
        fieldId,
        owner,
        address,
        place,
        requirement,
        standard,
        crop,
        extent,
        previousCropMeasures,
        seed,
        protect,
        soilType,
        manure
    } = req.body;

    
    if (!req.userData || !req.userData.userId) {
        return next(new HttpError("Unauthorized request.", 401));
    }

  
    let existingApplication;
    try {
        existingApplication = await Application.findOne({ fieldId });
    } catch (error) {
        console.log(error);
        
        return next(new HttpError('Creating application failed, please try again later.', 500));
    }

    if (existingApplication) {
        return next(new HttpError('An application with this field ID already exists.', 422));
    }

    const createdApplication = new Application({
        fieldId,
        owner,
        address,
        place: {
            latitude: place.lat,
            longitude: place.lng
        },
        requirement,
        standard,
        status: "Pending", 
        crop,
        extent,
        previousCropMeasures,
        seed,
        protect,
        soilType,
        manure,
        creator: req.userData.userId 
    });

    try {
        await createdApplication.save();
    } catch (error) {
        console.log(error);
        
        return next(new HttpError('Creating application failed, please try again.', 500));
    }

    res.status(201).json({ application: createdApplication.toObject({ getters: true }) });
};


const getApplicationById = async (req, res, next) => {
    const applicationId = req.params.aid; 

    let application;
    try {
        application = await Application.findById(applicationId)
            .populate("certification.certifier", "name"); 

    } catch (error) {
        return next(new HttpError("Fetching application failed, please try again later.", 500));
    }

    if (!application) {
        return next(new HttpError("Application not found.", 404));
    }

    res.json({ application: application.toObject({ getters: true }) }); 
};


exports.getApplicationById = getApplicationById;
exports.createApplication = createApplication;
exports.getApplications = getApplications;
exports.signup = signup;
exports.login =login;