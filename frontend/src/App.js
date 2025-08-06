import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProblemList from "./components/ProblemList";
import ProblemDetail from "./components/ProblemDetail";
import { Toaster } from "./components/ui/toaster";

// Placeholder components for other routes
const Contest = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Contests</h1>
    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
      <p className="text-gray-600">Contest feature coming soon!</p>
    </div>
  </div>
);

const Discuss = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Discuss</h1>
    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
      <p className="text-gray-600">Discussion forum coming soon!</p>
    </div>
  </div>
);

const Interview = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Interview</h1>
    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
      <p className="text-gray-600">Interview preparation coming soon!</p>
    </div>
  </div>
);

const Store = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Store</h1>
    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
      <p className="text-gray-600">LeetCode store coming soon!</p>
    </div>
  </div>
);

function App() {
  return (
    <div className="App bg-gray-50 min-h-screen">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<ProblemList />} />
          <Route path="/problems" element={<ProblemList />} />
          <Route path="/problems/:id" element={<ProblemDetail />} />
          <Route path="/contest" element={<Contest />} />
          <Route path="/discuss" element={<Discuss />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/store" element={<Store />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
