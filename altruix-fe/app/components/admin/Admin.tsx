import Interests from './Interests';
import EventHistory from './EventHistory';
import Analytics from './Analytics';
import Calendar from './Calendar';
import ManagedOrgs from './ManagedOrgs';
import type { Event } from '~/schemas/eventsSchema';


export default function Admin({
  user,  
  causes,
  allEvents
}: {
  user: any;
  causes: any;
  allEvents: Event[];
}) {
  const interestsList = user?.interests;
  const managedOrgs = user?.manages_orgs;
  console.log(`managedOrgs:`, JSON.stringify(managedOrgs));
  

    return (
        <>
            <div className="admin-header">Admin Dashboard</div>

            <div className="mt-10 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"> 
              <Interests 
              userInterests={interestsList}
              causes={causes}
              />
              <EventHistory />
              <Calendar />
              <Analytics />
            </div>
            <div className="mt-10 px-4 lg:px-6">
              <ManagedOrgs userOrgs={managedOrgs} allEvents={allEvents} />
            </div>

        </>
    )
};