import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

export function Login() {
    return (
        <Tabs defaultValue="account" className="w-[400px]">
            <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <form>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input id="email" type="email" name="email" />
                    </div>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input id="username" type="text" name="username" />
                    </div>
                </form>
            </TabsContent>
            <TabsContent value="password">
                <form>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input id="password" type="password" name="password" />
                    </div>
                </form>
            </TabsContent>
        </Tabs>
    )
}