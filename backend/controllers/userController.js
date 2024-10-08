import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModels.js";
import generateToken from "../utils/generateToken.js";

//@desc auth user & get token
//@route POST /api/users/login
//@access public
const authUser = asyncHandler(async (req,res) => {
    const {email, password } = req.body;
    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        generateToken(res,user._id);

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin:user.isAdmin,
        });
    }
    else{
        res.status(401);
        throw new Error('Invalid email or password');
    }
    
});

//@desc register user
//@route POST /api/users
//@access public
const registerUser = asyncHandler(async (req,res) => {
    const {name, email, password} = req.body;
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error("User already exists");
    }
    const user = await User.create({
        name,
        email,
        password,  
    });
    if(user){
        generateToken(res,user._id); 
          res.status(201).json({
            _id:user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    }else{
        res.status(400);
        throw new Error("Invalid User data")
    }
});

//@desc logout user & clear cookie
//@route POST /api/users/logout
//@access private
const logoutUser = asyncHandler(async (req,res) => {
   res.cookie('jwt','',{
    httpOnly:true,
    expires: new Date(0),
   });
   res.status(200).json({message:"logged out successful!"});
});

//@desc get user profile
//@route GET /api/users/profile
//@access private
const getUserProfile  = asyncHandler(async (req,res) => {
    const user = await User.findById(req.user._id);
    if(user){
        res.status(201).json({
            _id:user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    }else{
        res.status(400);
        throw new Error("user not found!")
    }
});

//@desc update user progile
//@route PUT /api/users/profile
//@access private
const updateUserProfile = asyncHandler(async (req,res) => {
    const user = await User.findById(req.user._id);
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.password){
            user.password = req.body.password;
        }
        const updateduser = await user.save();
    res.status(200).json({
        _id:updateduser._id,
            name: updateduser.name,
            email: updateduser.email,
            isAdmin: updateduser.isAdmin,
    });
    }else{
        res.status(404).json({message:"user not found"});
    }
    
});

//@desc get users
//@route GET /api/users/
//@access private/admin
const getUsers = asyncHandler(async (req,res) => {
    const pagesize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const count = await User.countDocuments();
    const users = await User.find({})
        .limit(pagesize)
        .skip(pagesize * (page - 1)); 
    res.json({users, page, pages: Math.ceil(count/pagesize)});
}); 

//@desc delete users
//@route DELETE /api/users/:id
//@access private/admin

const deleteUser = asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.id);
    if(user){
        if(user.isAdmin){
            res.status(400);
            throw new Error('Cannot delete admin user');
        }
        await User.deleteOne({_id: user._id});
        res.status(200).json({message: "user deleted successfully"});
    }else{
        res.status(404);
        throw new Error('User not found');
    }
});

//@desc getuserbyid
//@route GET /api/users/:id
//@access private/admin
const getUserbyID = asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.id).select('-password');
    if(user){
        res.status(200).json(user);
    }else{
        res.status(404);
        throw new Error('user not found');
    }
});

//@desc update user
//@route PUT /api/users/:id
//@access private/admin
const updateUser = asyncHandler(async (req,res) => {
    const user =  await User.findById(req.params.id);
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save();
        res.status(200).json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin,
        });
    }else{
        res.status(404);
        throw new Error('User not found');
    }
});

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserbyID,
    updateUser

};