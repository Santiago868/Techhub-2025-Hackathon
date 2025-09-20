import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"

export default function EventHistory() {

    return (
        <>
         <Card className="@container/card sm:text-center lg:text-left col-span-2 sm:col-span-1 border-0 rounded-xl bg-white/30 backdrop-blur-lg shadow-lg">
               <CardHeader>
                    <CardDescription>Where have you been?</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        Event History
                    </CardTitle>
                  </CardHeader>
                </Card>
        </>
    )
};