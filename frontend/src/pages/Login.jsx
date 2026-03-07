import { useState } from "react"

function Login() {

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

return (

<div className="min-h-screen flex items-center justify-center bg-gray-100">

<div className="bg-white p-8 rounded shadow w-96">

<h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

<input
type="email"
placeholder="Email"
className="w-full border p-2 mb-4 rounded"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="w-full border p-2 mb-4 rounded"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button className="w-full bg-blue-500 text-white p-2 rounded">
Login
</button>

</div>

</div>

)

}

export default Login