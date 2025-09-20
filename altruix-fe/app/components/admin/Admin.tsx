
import Interests from './Interests';
import EventHistory from './EventHistory';
import Analytics from './Analytics';
import Calendar from './Calendar';


export default function Admin({
  user,  
  causes
}: {
  user: any;
  causes: any;
}) {
  const interestsList = user?.interests;
  

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

        </>
    )
};