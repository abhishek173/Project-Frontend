import './App.css';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import ProductList from './components/ProductList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/Protected/ProtectedRoute';

function App() {
  return (

    <Router>
      <Header/>
        <Routes>
            <Route element={<ProtectedRoute/>}>
                    <Route path="/projects" element={<ProductList/>}/>
                    </Route>
            <Route path="/login" element={<LoginForm/>}/>
        </Routes>
    </Router>


  );
}

export default App;
