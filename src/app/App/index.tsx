import { lazy } from 'react'
import { Route, Routes } from 'react-router'
import { AppLayout } from '../../layouts/AppLayout'
import { routes } from '../routes'

const Home = lazy(() =>
  import('../../pages/Home').then(({ Home }) => ({ default: Home })),
)
const About = lazy(() =>
  import('../../pages/About').then(({ About }) => ({ default: About })),
)
const NotFound = lazy(() =>
  import('../../pages/NotFound').then(({ NotFound }) => ({ default: NotFound })),
)

export const App = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route index element={<Home />} />
      <Route path={routes.about} element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
)
