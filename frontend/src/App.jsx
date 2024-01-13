import {BrowserRouter,Routes,Route} from "react-router-dom"
import DashboardPages from "./pages/DashboardPages"
import LoginPages from "./pages/LoginPages"
import RegisterPages from "./pages/RegisterPages"
import ProfilePages from "./pages/ProfilePages"
import SearchPages from "./pages/SearchPages"
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<DashboardPages/>}/>
      <Route path="/login" element={<LoginPages/>}/>
      <Route path="/register" element={<RegisterPages/>}/>
      <Route path="/profile" element={<ProfilePages/>}/>
      <Route path="/search" element={<SearchPages/>}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App

