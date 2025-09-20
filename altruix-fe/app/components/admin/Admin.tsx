import Interests from './Interests';
import EventHistory from './EventHistory';
import Analytics from './Analytics';
import Rating from './Rating';
import Calendar from './Calendar';

export default function Admin() {

    return (
        <>
            <div className="admin-header">Admin Dashboard</div>
            <section className="admin-grid" aria-label="Admin dashboard panels">
                <div className="admin-card"><Interests /></div>
                <div className="admin-card"><EventHistory /></div>
                <div className="admin-card"><Analytics /></div>
                <div className="admin-card"><Rating /></div>
                <div className="admin-card"><Calendar /></div>
            </section>
        </>
    )
};