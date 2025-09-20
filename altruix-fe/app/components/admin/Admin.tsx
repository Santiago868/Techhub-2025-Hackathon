import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "../ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"


import Interests from './Interests';
import EventHistory from './EventHistory';
import Analytics from './Analytics';
import Rating from './Rating';
import Calendar from './Calendar';

export default function Admin() {

    return (
        <>
            <div className="admin-header">Admin Dashboard</div>

            <div className="mt-10 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                <Card className="@container/card">
                  <CardHeader>
                    <CardDescription>What are you into?</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                      <Interests />
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className="@container/card">
                  <CardHeader>
                    <CardDescription>Where have you been?</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                      <EventHistory />
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className="@container/card">
                  <CardHeader>
                    <CardDescription>What do people think?</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                      <Rating />
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className="@container/card">
                  <CardHeader>
                    <CardDescription>What's coming up?</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                      <Calendar />
                    </CardTitle>
                  </CardHeader>
                </Card>
                 <Card className="@container/card col-span-2 text-center">
                  <CardHeader>
                    <CardDescription>How are you doing?</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                      <Analytics />
                    </CardTitle>
                  </CardHeader>
                </Card>
            </div>

        </>
    )
};