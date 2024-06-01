import { BrowserRouter } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import AppUI from "./AppUI";

function LocationProvider({ children }: React.PropsWithChildren) {
    return <AnimatePresence>{children}</AnimatePresence>;
}

function Router() {
  return (
    <>
        <BrowserRouter>
            <LocationProvider>
                <AppUI/>
            </LocationProvider>
        </BrowserRouter>
    </>
  )
}

export default Router
