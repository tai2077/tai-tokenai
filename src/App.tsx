import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { AnimatePresence } from "framer-motion";
import { manifestUrl } from "./lib/tonconnect";
import Layout from "./components/Layout";
import { Skeleton } from "./components/Skeleton";
import { SplashScreen } from "./components/SplashScreen";
import { PageTransition } from "./components/PageTransition";

// Lazy load pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Launch = lazy(() => import("./pages/Launch"));
const Ops = lazy(() => import("./pages/Ops"));
const Market = lazy(() => import("./pages/Market"));
const TokenDetail = lazy(() => import("./pages/TokenDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const Deposit = lazy(() => import("./pages/Deposit"));
const Withdraw = lazy(() => import("./pages/Withdraw"));
const C2C = lazy(() => import("./pages/C2C"));
const C2COrderDetail = lazy(() => import("./pages/C2COrderDetail"));
const AutoWithdraw = lazy(() => import("./pages/AutoWithdraw"));
const Trade = lazy(() => import("./pages/Trade"));

export default function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <Router>
        <Layout>
          <Suspense fallback={
            <div className="flex flex-col gap-4 p-4 mt-10 max-w-md mx-auto">
              <Skeleton height="100px" />
              <Skeleton height="200px" />
              <Skeleton height="60px" />
            </div>
          }>
            <AnimatedRoutes />
          </Suspense>
        </Layout>
      </Router>
    </TonConnectUIProvider>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/launch" element={<PageTransition><Launch /></PageTransition>} />
        <Route path="/ops" element={<PageTransition><Ops /></PageTransition>} />
        <Route path="/market" element={<PageTransition><Market /></PageTransition>} />
        <Route path="/token/:address" element={<PageTransition><TokenDetail /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/deposit" element={<PageTransition><Deposit /></PageTransition>} />
        <Route path="/withdraw" element={<PageTransition><Withdraw /></PageTransition>} />
        <Route path="/c2c" element={<PageTransition><C2C /></PageTransition>} />
        <Route path="/c2c/order/:id" element={<PageTransition><C2COrderDetail /></PageTransition>} />
        <Route path="/auto-withdraw" element={<PageTransition><AutoWithdraw /></PageTransition>} />
        <Route path="/trade" element={<PageTransition><Trade /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}
