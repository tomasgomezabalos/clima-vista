import { Route, Routes } from 'react-router'
import { AppLayout } from '../../layouts/AppLayout'
import { lazyPage } from '../lazyPage'
import { routes } from '../routes'

const Home = lazyPage(() =>
  import('../../pages/Home').then(({ Home }) => ({ default: Home })),
)
const About = lazyPage(() =>
  import('../../pages/About').then(({ About }) => ({ default: About })),
)
const NotFound = lazyPage(() =>
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
