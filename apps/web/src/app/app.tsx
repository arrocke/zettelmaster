import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Root from "./Root";
import NoteView from "./NoteView";

const queryClient = new QueryClient()

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="notes/:noteId" element={<NoteView />} />
    </Route>
  )
);

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App

