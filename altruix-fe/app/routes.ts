import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
    index('./routes/home.tsx'),                              
    route('homepage', './routes/homepage.tsx'),            
    route('login', './routes/login.tsx'),                  
    route('admin/:accountId', './routes/admin.tsx'),      
    route('events/:eventId', './routes/event.tsx'),   

] satisfies RouteConfig;
