import { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

interface Cause {
  category: string;
  causes: string[];
}

interface CausesData {
  causes: Cause[];
}

export default function Interests({
  userInterests,
  causes
}: {
  userInterests: string[];
  causes: CausesData;
}) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(userInterests || []);

  return (
    <>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>What are you into?</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Interests
          </CardTitle>
        </CardHeader>
        <div className="p-6 space-y-8">
          {causes?.causes?.map((category) => (
            <div key={category.category} className="space-y-4">
              <h3 className="font-semibold text-base text-gray-900 border-b border-gray-200 pb-2">
                {category.category}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedInterests.filter(interest => category.causes.includes(interest)).length > 0 
                      ? `${selectedInterests.filter(interest => category.causes.includes(interest)).length} selected`
                      : `Select ${category.category.toLowerCase()}`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80">
                  <DropdownMenuSeparator />
                  {category.causes.map((cause) => (
                    <DropdownMenuCheckboxItem
                      key={cause}
                      checked={selectedInterests.includes(cause)}
                      onCheckedChange={(checked: boolean) => {
                        if (checked) {
                          setSelectedInterests(prev => [...prev, cause]);
                        } else {
                          setSelectedInterests(prev => prev.filter(item => item !== cause));
                        }
                      }}
                    >
                      {cause}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}