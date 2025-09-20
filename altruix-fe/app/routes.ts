import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
    index('./routes/home.tsx'),
    route('homepage', './routes/homepage.tsx'),
    route('login', './routes/login.tsx'),
    // Explicit /admin path that redirects to a standard fake account for now
    route('admin', './routes/admin.tsx'),
    // Dynamic admin route - filename is admin.$id.tsx so param should be :id
    route('admin/:id', './routes/admin.$id.tsx'),
    route('events/:eventId', './routes/event.tsx'),
] satisfies RouteConfig;
