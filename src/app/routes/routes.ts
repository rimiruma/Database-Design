import  { Router } from "express";
import { AuthRouter } from "../modules/auth/auth.route";
const router: Router = Router();

const modulerRoutes = [
    { 
        path: "/auth", 
        route: AuthRouter 
    }
];

modulerRoutes.forEach((route) => router.use(route.path, route.route));

export default router;