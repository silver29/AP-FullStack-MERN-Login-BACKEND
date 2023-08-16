import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from '../config.js'

export const authRequired = (req, res, next) => {
    //console.log('validing token')
    //console.log(req.headers);
    //const token = req.headers.cookie;
    const { token } = req.cookies;

        if(!token)
            return res.status(401).json({ message:"No token, authorization denied" });
        
        jwt.verify(token, TOKEN_SECRET,(err,user) => {
            if(err) return res.status(403).json({ message:"Invalid token" });
            //console.log(user);
            /*req user es la petición de que está llegando y se guarda ahí, cuando se llame a req se puede acceder luego a la información que se ha guardado ahí*/
            // Se guarda el usuario
            req.user = user;
            next();
        })
    //console.log(token);
};