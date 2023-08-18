import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { createAccessToken } from "../libs/jwt.js"
import jwt from 'jsonwebtoken'

export const register = async (req,res) => {
    const { email, password, username } = req.body

    try {
        const userFound = await User.findOne({email});
        if(userFound) 
            return res.status(400).json(["the email is already in use"]);
        // Diez veces se ejecuta el algoritmo, genera una cadena String
        const passwordHash = await bcrypt.hash(password,10); 
        const newUser = new User({
            username,
            email,
            password: passwordHash
        })

        console.log(newUser);
        const userSaved = await newUser.save();
        const token = await createAccessToken({id: userSaved._id})
        //res.send('registrando');
        //res.json(userSaved)
        //res.json({ token });
        res.cookie('token',token, {
            httpOnly:true,
            maxAge:36000005,
            secure:true,
            sameSite:'none',
            domain: 'vercel.app'
         })

        /* res.json({
            message:"User created successfully",
        }) */

        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt,
        }) 

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
    
    //console.log(email, password, username)
};

export const login = async (req,res) => {
    const { email, password } = req.body

    try {
        const userFound = await User.findOne({email});

        if(!userFound) return res.status(400).json({ message: "User not found" });
        
        const isMatch = await bcrypt.compare(password,userFound.password);
        if (!isMatch) 
            return res.status(400).json({ message:"Incorrect password" });        

        const token = await createAccessToken({id: userFound._id});
        
        res.cookie('token',token);
        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
        }); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
    
    //console.log(email, password, username)
};

export const logout = (req, res) => {
    res.cookie('token',"", {
        expires: new Date(0)
    })
    return res.sendStatus(200);
}

export const profile = async (req, res) => {
    //console.log(req.user)
    //res.send('profile')
    const userFound = await User.findById(req.user.id)

    if(!userFound) return res.status(400).json({ message:"User not found" });

    return res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt,
    })
}

/* Posible solución al problema de una vez hecho login, entrar y luego te bota a login 
al refrescar la página  npm i js-cookie */ 

export const verifyToken = async (req,res) => {
    
    const {token} = req.cookies 

    if(!token) return res.status(401).json({ message:"Unauthorized" });

    jwt.verify(token,process.env.TOKEN_SECRET, async (err,user) => {
        if(err) return res.status(401).json({ message:"Unauthorized" });

        const userFound = await User.findById(user.id)
        if(!userFound) return res.status(401).json({ message:
        "Unauthorized" });

        return res.json({
            id: userFound._id,
            username: userFound.username, 
            email: userFound.email,
        });
    });
};
