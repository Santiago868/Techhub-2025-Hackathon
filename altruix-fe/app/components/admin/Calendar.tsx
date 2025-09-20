import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"

export default function Calendar() {

    return (
        <>
         <Card className="@container/card col-span-2 text-center border-0 rounded-xl bg-white/30 backdrop-blur-lg shadow-lg">
               <CardHeader>
                    <CardDescription>What's coming up?</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        Calendar
                    </CardTitle>
                  </CardHeader>
                </Card>
        </>
    )
};