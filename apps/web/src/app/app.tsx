import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from "react-router-dom";
import Root from "./Root";
import NoteView from "./NoteView";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="notes/:noteId" element={<NoteView />} />
    </Route>
  )
);

export const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App

