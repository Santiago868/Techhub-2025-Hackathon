import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"

export default function EventHistory() {

    return (
        <>
         <Card className="@container/card text-left sm:text-center lg:text-left w-full border-0 rounded-xl bg-white/30 backdrop-blur-lg shadow-lg">
               <CardHeader>
                    <CardDescription className="text-left">Where have you been?</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        Event History
                    </CardTitle>
                  </CardHeader>
                </Card>
        </>
    )
};