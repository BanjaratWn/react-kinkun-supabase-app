import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx'
import AddKinkun from './pages/AddKinkun.jsx'
import EditKinkun from './pages/EditKinkun.jsx'
import ShowAllKinkun from './pages/ShowAllKinkun.jsx'

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Routes path="/" element={<Home />} />
          <Routes path="/addkinkun" element={<AddKinkun />} />
          <Routes path="/editkinkun" element={<EditKinkun />} />
          <Routes path="/showallkinkun" element={<ShowAllKinkun />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
