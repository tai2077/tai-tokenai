import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { manifestUrl } from "./lib/tonconnect";
import Layout from "./components/Layout";
import { Skeleton } from "./components/Skeleton";
import { SplashScreen } from "./components/SplashScreen";

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
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/launch" element={<Launch />} />
              <Route path="/ops" element={<Ops />} />
              <Route path="/market" element={<Market />} />
              <Route path="/token/:address" element={<TokenDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/deposit" element={<Deposit />} />
              <Route path="/withdraw" element={<Withdraw />} />
              <Route path="/c2c" element={<C2C />} />
              <Route path="/c2c/order/:id" element={<C2COrderDetail />} />
              <Route path="/auto-withdraw" element={<AutoWithdraw />} />
              <Route path="/trade" element={<Trade />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </TonConnectUIProvider>
  );
}
