import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"

export default function Analytics() {

    return (
        <>
         <Card className="@container/card col-span-2 text-center">
               <CardHeader>
                    <CardDescription>How are you doing?</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        Analytics
                    </CardTitle>
                  </CardHeader>
                </Card>
        </>
    )
};