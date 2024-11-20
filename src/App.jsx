import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AudioPlayer from "./components/AudioPlayer";
import Home from "./components/Home";
import UpdateForm from "./components/UpdateForm";
import Login from "./components/Login";
import DelphiPage from "./components/DelphiPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AudioPlayer />} />
        <Route path="/update" element={<UpdateForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/interact" element={<DelphiPage />} />
        <Route path="/artofconversation" element={<AudioPlayer />} />
      </Routes>
    </Router>
  );
}

export default App;
