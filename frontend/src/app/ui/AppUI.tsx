import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import { MainPage } from '@/pages/Main';
import { Layout } from '@/shared';

function AppUI() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.key}>
      <Route path='/' element={<Layout/>}>
        <Route path="/" element={<MainPage />}/>
      </Route>
    </Routes>
  );
}

export default AppUI
