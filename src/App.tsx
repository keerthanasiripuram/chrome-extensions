import AddBlocker from "./components/AddBlocker"
import NoteTaker from "./components/NoteTaker"
import ProductivityTracker from "./components/ProductivtyTracker"
import TabManager from "./components/TabManager"

function App() {
  return (
    <>
    <TabManager/>
    <ProductivityTracker/>
    {/* <AddBlocker/> */}
    <NoteTaker/>
    </>
  )
}

export default App
