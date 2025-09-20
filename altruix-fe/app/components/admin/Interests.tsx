import { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"

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
              <ToggleGroup 
                type="multiple" 
                variant="outline"
                value={selectedInterests.filter(interest => category.causes.includes(interest))}
                onValueChange={(newValue) => {
                  const otherInterests = selectedInterests.filter(interest => !category.causes.includes(interest));
                  setSelectedInterests([...otherInterests, ...newValue]);
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full"
              >
                {category.causes.map((cause) => (
                  <ToggleGroupItem 
                    key={cause} 
                    value={cause} 
                    className={`text-sm p-3 h-auto text-left justify-start whitespace-normal leading-relaxed ${
                      selectedInterests.includes(cause) 
                        ? 'bg-gray-800 text-white border-gray-800 hover:bg-gray-700' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    {cause}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}