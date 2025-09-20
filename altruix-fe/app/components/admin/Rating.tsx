import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"

export default function Rating() {

    return (
        <>
         <Card className="@container/card">
               <CardHeader>
                    <CardDescription>What do people think?</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        Rating
                    </CardTitle>
                  </CardHeader>
                </Card>
        </>
    )
};