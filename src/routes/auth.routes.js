import { Router } from 'express';
import { 
    login, 
    register, 
    logout, 
    profile,
    verifyToken 
} from '../controllers/auth.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

const router = Router();

router.post('/register', validateSchema(registerSchema), register);

router.post('/login', validateSchema(loginSchema), login);

router.post('/logout', logout);

router.get('/profile', authRequired, profile );

/* Posible solución al problema de una vez hecho login, entrar y luego te bota a login 
    al refrescar la página  npm i js-cookie */ 
router.get('/verify', verifyToken);

export default router;