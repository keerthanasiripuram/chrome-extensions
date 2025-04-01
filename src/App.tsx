import AddBlocker from "./components/AddBlocker"
import NoteTaker from "./components/note-taker/NoteTaker"
import NoteTaker1 from "./components/note-taker/NoteTaker1"
import ProductivityTracker from "./components/ProductivtyTracker"
import TabManager from "./components/TabManager"

function App() {
  return (
    <>
    <TabManager/>
    <ProductivityTracker/>
    {/* <AddBlocker/> */}
    <NoteTaker1/>
    </>
  )
}

export default App
